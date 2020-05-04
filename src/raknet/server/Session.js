const Packet = require("../protocol/Packet");

const RakNet = require("../RakNet");
const BinaryStream = require("../../binarystream/BinaryStream");

const Datagram = require("../protocol/Datagram");
const EncapsulatedPacket = require("../protocol/EncapsulatedPacket");
const ConnectionRequest = require("../protocol/ConnectionRequest");
const ConnectionRequestAccepted = require("../protocol/ConnectionRequestAccepted");
const NewIncomingConnection = require("../protocol/NewIncomingConnection");
const ConnectedPing = require("../protocol/ConnectedPing");
const ConnectedPong = require("../protocol/ConnectedPong");
const DisconnectionNotification = require("../protocol/DisconnectionNotification");

const PacketReliability = require("../protocol/PacketReliability");

const ACK = require("../protocol/ACK");
const NACK = require("../protocol/NACK");

const RecoveryQueue = require("./queues/RecoveryQueue");
const ACKQueue = require("./queues/ACKQueue");
const NACKQueue = require("./queues/NACKQueue");
const SplitQueue = require("./queues/SplitQueue");
const PacketBatchHolder = require("./queues/PacketBatchHolder");

const MessageIdentifiers = require("../protocol/MessageIdentifiers");

class Session {
    static get STATE_CONNECTING(){return 0}
    static get STATE_CONNECTED(){return 1}
    static get STATE_DISCONNECTING(){return 2}
    static get STATE_DISCONNECTED(){return 3}

    get WINDOW_SIZE(){
        return 2048;
    }

    get MAX_SPLIT_SIZE(){
        return 128;
    }

    get MAX_SPLIT_COUNT(){
        return 4;
    }

    messageIndex = 0;
    channelIndex = [];

    sessionManager;

    address;
    port;
    state = Session.STATE_DISCONNECTED;
    mtuSize = 548;
    clientId;
    splitId;

    lastSeqNumber = -1;
    sendSeqNumber = 0;

    lastUpdate = 0;
    startTime = 0;
    
    packetToSend = [];

    isActive = false;

    ACKQueue = new ACKQueue();
    NACKQueue = new NACKQueue();

    recoveryQueue = new RecoveryQueue();

    splitQueue = new SplitQueue();  // splitPackets

    needACK = new Map();

    sendQueue = new Datagram();

    windowStart = null;

    receiveWindow = new Map();
    windowEnd = null;

    reliableWindowStart = null;
    reliableWindowEnd = null;
    reliableWindow = new Map();
    lastReliableIndex = -1;

    packetBatches = new PacketBatchHolder();  // why this one is needed?

    constructor(sessionManager, address, port, clientId, mtuSize){
        this.sessionManager = sessionManager;
        this.address = address;
        this.port = port;
        this.sendQueue = new Datagram();
        this.lastUpdate = Date.now();
        this.startTime = Date.now();
        this.windowStart = -1;
        this.windowEnd = this.WINDOW_SIZE;

        // Optional
        this.clientId = clientId;
        this.mtuSize = mtuSize;

        this.reliableWindowStart = 0;
        this.reliableWindowEnd = this.WINDOW_SIZE;

        for (let i in Array(32).keys()) {
            this.channelIndex[i] = 0;
        }
    }

    getAddress(){
        return this.address;
    }

    getPort(){
        return this.port;
    }

    isConnected(){
        return this.state !== Session.STATE_DISCONNECTING && this.state !== Session.STATE_DISCONNECTED;
    }

    setConnected(){
        this.state = Session.STATE_CONNECTED;
        this.lastUpdate = Date.now();
        this.sessionManager.getLogger().debug(this+" is now connected.");
    }

    update(time){
        if(!this.isActive && (this.lastUpdate + 10000) < time){
            this.disconnect("timeout");
            return;
        }
        this.isActive = false;

        if(this.ACKQueue.size > 0){
            let pk = new ACK();
            pk.packets = this.ACKQueue.getAll();
            this.sendPacket(pk);
            this.ACKQueue.clear();
        }

        if(this.NACKQueue.size > 0){
            let pk = new NACK();
            pk.packets = this.NACKQueue.getAll();
            this.sendPacket(pk);
            this.NACKQueue.clear();
        }

        if(this.packetToSend.length > 0){
            let limit = 16;
            for(let k in this.packetToSend){
                if (this.packetToSend.hasOwnProperty(k)) {
                    let pk = this.packetToSend[k];
                    pk.sendTime = time;
                    this.recoveryQueue.addRecoveryFor(pk.sequenceNumber);
                    delete this.packetToSend[k];
                    this.sendDatagram(this.packetToSend[k]);
                }

                if(--limit <= 0){
                    break;
                }
            }

            if (this.packetToSend.length > this.WINDOW_SIZE) {
                this.packetToSend = [];
            }
        }

        if (this.needACK.size > 0) {
            for (let [identifierACK, indexes] of this.needACK) {
                if (indexes.length === 0){
                    this.needACK.delete(identifierACK);
                    // Notify ACK
                }
            }
        }

        for (let seq in this.recoveryQueue.keys()) {
            if (this.recoveryQueue.hasOwnProperty(seq)) {
                let pk = this.recoveryQueue.get(seq);
                if (!pk.sendTime) {
                    this.packetToSend.push(pk);
                    this.recoveryQueue.delete(seq);
                }

                if (pk.sendTime < time - 8) {
                    this.packetToSend.push(pk);
                    this.recoveryQueue.delete(seq);
                }
            }
        }

        // if(this.lastPingTime + 5000 < time){
        //     this.sendPing();
        //     this.lastPingTime = time;
        // }

        this.sendTheQueue();
    }


    close(){
        if(this.state !== Session.STATE_DISCONNECTED){
            this.state = Session.STATE_DISCONNECTED;

            this.queueConnectedPacket(new DisconnectionNotification(), PacketReliability.RELIABLE_ORDERED, 0, RakNet.PRIORITY_IMMEDIATE);

            this.sessionManager.getLogger().debug(`Closed session for ${this.toString()}`);
            this.sessionManager.removeSessionInternal(this);
            this.sessionManager = null;
        }
    }

    disconnect(reason = "unknown"){
        this.sessionManager.removeSession(this, reason);
    }

    handlePacket(packet){
        this.isActive = true;
        this.lastUpdate = Date.now();

        if(packet instanceof Datagram){
            packet.decode();

            let diff = packet.sequenceNumber - this.lastSeqNumber;

            if(this.NACKQueue.has(packet.sequenceNumber)){
                this.NACKQueue.remove(packet.sequenceNumber);
            }

            this.ACKQueue.add(packet.sequenceNumber);
            // receive window

            if(diff !== 1){
                for(let i = this.lastSeqNumber + 1; i < packet.sequenceNumber; i++){
                    // receive window
                    this.NACKQueue.add(i);
                }
            }

            if(diff >= 1){
                this.lastSeqNumber = packet.sequenceNumber;
                this.windowStart += diff;
                this.windowEnd += diff;
            }

            packet.packets.forEach(pk => this.handleEncapsulatedPacket(pk));
        }else if (packet instanceof ACK) {
            packet.decode();
            this.recoveryQueue.recover(packet.packets).forEach(datagram => {
                this.recoveryQueue.remove(datagram.sequenceNumber);
            });
        }else if (packet instanceof NACK) {
            packet.decode();
            this.recoveryQueue.recover(packet.packets).forEach(datagram => {
                this.packetToSend.push(datagram);
                this.recoveryQueue.remove(datagram.sequenceNumber);
            });
        }
    }

    handleEncapsulatedPacket(packet){
        if (packet.messageIndex === null){
            this.handleEncapsulatedPacketRoute(packet);
        }else {
            if (packet.messageIndex < this.reliableWindowStart || packet.messageIndex > this.reliableWindowEnd) {
                return;
            }

            if (packet.messageIndex - this.lastReliableIndex === 1) {
                this.lastReliableIndex += 1;
                this.reliableWindowStart += 1;
                this.reliableWindowEnd += 1;
                this.handleEncapsulatedPacketRoute(packet);

                if (this.reliableWindow.size > 0) {
                    Object.entries(this.reliableWindow).sort();
                    for (let [index, pk] of this.reliableWindow) {
                        if (index - this.lastReliableIndex !== 1) {
                            break;
                        }
                        this.lastReliableIndex += 1;
                        this.reliableWindowStart += 1;
                        this.reliableWindowEnd += 1;
                        this.handleEncapsulatedPacketRoute(packet);
                        this.reliableWindow.delete(index);
                    }
                }
            }
        }
    }

    handleEncapsulatedPacketRoute(packet) {
        if (this.sessionManager === null) {
            return;
        }

        if(packet.hasSplit){
            if(this.isConnected()) this.handleSplitPacket(packet);
            return;
        }

        let id = packet.getBuffer()[0];
        let dpk, pk;
        switch(id){
            case ConnectionRequest.getId():
                this.sessionManager.getLogger().debug("Got ConnectionRequest from "+this);
                dpk = new ConnectionRequest(packet.getStream());
                dpk.decode();

                this.clientId = dpk.clientId;

                pk = new ConnectionRequestAccepted();
                pk.address = this.getAddress();
                pk.port = this.getPort();
                pk.sendPingTime = dpk.sendPingTime;
                pk.sendPongTime = this.sessionManager.getTimeSinceStart();
                this.queueConnectedPacket(pk, PacketReliability.UNRELIABLE, 0, RakNet.PRIORITY_IMMEDIATE);
                break;

            case NewIncomingConnection.getId():
                this.sessionManager.getLogger().debug("Got NewIncomingConnection from "+this);

                dpk = new NewIncomingConnection(packet.getStream());
                dpk.decode();

                if(dpk.port === this.sessionManager.getPort()){ //todo: if port checking
                    this.setConnected();

                    this.sessionManager.openSession(this);

                    this.sendPing();
                }
                break;

            case ConnectedPing.getId():
                dpk = new ConnectedPing(packet.getStream());
                dpk.decode();

                pk = new ConnectedPong();
                pk.sendPingTime = dpk.sendPingTime;
                pk.sendPongTime = this.sessionManager.getTimeSinceStart();
                this.queueConnectedPacket(pk, PacketReliability.UNRELIABLE, 0);
                break;

            case ConnectedPong.getId():
                dpk = new ConnectedPong(packet.getStream());
                dpk.decode();

                this.handlePong(dpk.sendPingTime, dpk.sendPongTime);
                break;

            case DisconnectionNotification.getId():
                this.disconnect("client disconnect"); //supposed to send ack
                break;

            case MessageIdentifiers.MINECRAFT_HEADER:
                this.packetBatches.add(packet);
                this.sessionManager.getLogger().debug("Got a Minecraft packet");
                break;

            default:
                this.packetBatches.add(packet);
                this.sessionManager.getLogger().debug("Got unknown packet: ", id);
                break;
        }
    }

    handlePong(ping, pong){
        this.lastPingMeasure = this.sessionManager.getTimeSinceStart() - ping;
    }

    handleSplitPacket(packet){
        if(packet.splitCount >= this.MAX_SPLIT_SIZE || packet.splitIndex < 0){
            return;
        }

        if(this.splitQueue.size >= this.MAX_SPLIT_COUNT) return;
        this.splitQueue.add(packet);

        if(this.splitQueue.getSplitSize(packet.splitId) === packet.splitCount){
            let pk = new EncapsulatedPacket();
            let stream = new BinaryStream();
            let packets = this.splitQueue.getSplits(packet.splitId);
            for(let [splitIndex, packet] of packets){
                stream.append(packet.getBuffer());
            }
            this.splitQueue.remove(packet.splitId);

            pk.stream = stream.flip();
            pk.length = stream.offset;

            this.handleEncapsulatedPacket(pk);
        }
    }

    sendPacket(pk){
        if(pk instanceof Packet){
            this.sessionManager.sendPacket(pk, this);
            return true;
        }
        return false;
    }

    sendDatagram(datagram){
        if(!(datagram instanceof Datagram)) throw new TypeError("Expecting Datagram, got "+(datagram.constructor.name ? datagram.constructor.name : datagram));

        if(datagram.sequenceNumber !== null){
            this.recoveryQueue.remove(datagram.sequenceNumber);
        }
        datagram.sequenceNumber = this.sendSeqNumber++;
        datagram.sendTime = Date.now();
        this.recoveryQueue.addRecoveryFor(datagram);
        this.sendPacket(datagram);
    }

    sendPing(reliability = PacketReliability.UNRELIABLE){
        let pk = new ConnectedPing();
        pk.sendPingTime = this.sessionManager.getTimeSinceStart();
        this.queueConnectedPacket(pk, reliability, 0, RakNet.PRIORITY_IMMEDIATE);
    }

    queueConnectedPacket(packet, reliability, orderChannel, flags = RakNet.PRIORITY_NORMAL){
        packet.encode();

        let pk = new EncapsulatedPacket();
        pk.reliability = reliability;
        pk.orderChannel = orderChannel;
        pk.stream = new BinaryStream(packet.getBuffer());

        //this.sessionManager.getLogger().debug("Queuing "+protocol.constructor.name+"("+protocol.getBuffer().toString("hex")+")");

        this.addEncapsulatedToQueue(pk, flags);
    }

    queueConnectedPacketFromServer(packet, needACK, immediate){
        return this.queueConnectedPacket(packet, (needACK === true ? RakNet.FLAG_NEED_ACK : 0) | (immediate === true ? RakNet.PRIORITY_IMMEDIATE : RakNet.PRIORITY_NORMAL));
    }

    addEncapsulatedToQueue(packet, flags){
        packet.needACK = (flags & RakNet.FLAG_NEED_ACK);
        if (packet.needACK > 0) {
            // TODO: need ack
        }

        let reliability = packet.reliability;
        if (reliability === 2 || reliability === 3 || reliability === 4 || reliability === 6 || reliability === 7) {
            this.messageIndex += 1;
            packet.messageIndex = this.messageIndex;
            if (reliability === 3) {
                this.channelIndex[packet.orderIndex] += 1;
                packet.orderIndex = this.channelIndex[packet.orderChannel];
            }
        }

        let maxSize = this.mtuSize - 60;
        if(packet.getBuffer().length > maxSize){
            this.splitId += 1;
            let splitId = this.splitId % 65536;
            let splitIndex = 0;
            let splitCount = Math.ceil(packet.getBuffer().length / maxSize);
            while(!packet.getStream().feof()){
                let stream = packet.getBuffer().slice(packet.getStream().offset, packet.getStream().offset += maxSize);
                let pk = new EncapsulatedPacket();
                pk.splitId = splitId;
                pk.hasSplit = true;
                pk.splitCount = splitCount;
                pk.reliability = packet.reliability;
                pk.splitIndex = splitIndex;
                pk.stream = stream;
                if (splitIndex > 0) {
                    this.messageIndex += 1;
                    pk.messageIndex = this.messageIndex;
                } else {
                    pk.messageIndex = packet.messageIndex;
                }

                if (pk.reliability === 3) {
                    pk.orderChannel = packet.orderChannel;
                    pk.orderIndex = packet.orderIndex;
                }

                this.addToQueue(pk, flags | RakNet.PRIORITY_IMMEDIATE);
                splitIndex++;
            }
        }else{
            this.addToQueue(packet, flags);
        }
    }

    addToQueue(pk, flags = RakNet.PRIORITY_NORMAL){
        let priority = flags & 0b0000111;
        // TODO
        // if (pk.needACK && pk.messageIndex !== null) {
        //     this.sendQueue.packets.push(pk);
        // }

        // Skip queues
        if (priority === RakNet.PRIORITY_IMMEDIATE) {
            let packet = new Datagram();
            this.sendSeqNumber += 1;
            packet.sequenceNumber = this.sendSeqNumber;
            if (pk.needACK) {
                packet.packets.push(Object.assign({}, pk));
                pk.needACK = false;
            }else{
                packet.packets.push(pk.toBinary());
            }
            this.sendPacket(packet);
            packet.sendTime = Date.now();
            this.recoveryQueue.addRecoveryFor(packet);
        }

        let length = this.sendQueue.getLength();
        if((length + pk.getLength()) > this.mtuSize){
            this.sendTheQueue();
        }

        if(pk.needACK){
            this.sendQueue.packets.push(Object.assign({}, pk));
            pk.needACK = false;
        }else{
            this.sendQueue.packets.push(pk.toBinary());
        }
    }

    sendTheQueue(){
        if (!(typeof this.sendQueue.packets === "undefined")) {
            if (this.sendQueue.packets.length > 0) {
                this.sendDatagram(this.sendQueue);
                this.sendQueue = new Datagram();
            }
        }
    }

    toString(){
        return this.address + ":" + this.port;
    }
}

module.exports = Session;