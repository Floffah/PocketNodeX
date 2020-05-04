const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

"use strict";

class TickSyncPacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.TICK_SYNC_PACKET;

    /** @type {number} */
    clientSendTime;
    /** @type {number} */
    serverReceiveTime;

    _decodePayload() {
        this.clientSendTime = this.readLLong();
        this.serverReceiveTime = this.readLLong();
    }

    _encodePayload() {
        this.writeLLong(this.clientSendTime);
        this.writeLLong(this.serverReceiveTime);
    }

    handle(session) {
        return session.handleTickSync(this);
    }
}

module.exports = TickSyncPacket;