const DataPacket = require("./DataPacket");
const BinaryStream = require("../NetworkBinaryStream");
const Zlib = require("zlib");

class BatchPacket extends DataPacket {

    static getId() {
        return 0xFE;
    }

    /** @type {BinaryStream} */
    payload = new BinaryStream();
    /** @type {number} */
    _compressionLevel = 7;

    /** @return {boolean} */
    canBeBatched() {
        return false;
    }

    /** @return {boolean} */
    canBeSentBeforeLogin() {
        return true;
    }

    _decodeHeader() {
        let pid = this.readByte();
        if (pid !== this.getId()) {
            throw new Error("Received " + pid + " as the id, expected " + this.getId());
        }
    }

    _decodePayload() {
        let data = this.readRemaining();
        try {
            this.payload = new BinaryStream(Zlib.unzipSync(data, {chunkSize: 1024 * 1024 * 2}));
        }catch (e) {
            this.payload = new BinaryStream();
        }
    }

    _encodeHeader() {
        this.writeByte(this.getId());
    }

    _encodePayload() {
        let buf = Zlib.deflateSync(this.payload.getBuffer(), {level: this._compressionLevel});
        this.append(buf);
    }

    /** @param packet {DataPacket} */
    addPacket(packet) {
        if (!packet.canBeBatched()) {
            throw new Error(packet.getName() + " can't be batched");
        }

        if (!packet.isEncoded) {
            packet.encode();
        }

        this.payload.writeUnsignedVarInt(packet.buffer.length);
        this.payload.append(packet.getBuffer());
    }

    getPackets() {
        let pks = [];
        while (!this.payload.feof()) {
            pks.push(this.payload.read(this.payload.readUnsignedVarInt()));
        }
        return pks;
    }

    handle(session, logger) {
        if (this.payload.length === 0) {
            return false;
        }

        this.getPackets().forEach(buf => {
            let pk = session.raknetAdapter.packetPool.getPacket(buf[0]);

            if (pk instanceof DataPacket) {
                if (!pk.canBeBatched()) {
                    throw new Error("Received invalid " + pk.getName() + " inside BatchPacket");
                }

                pk.setBuffer(buf, 1);
                session.handleDataPacket(pk);
            } else {
                logger.debug("Got unhandled packet: 0x" + buf.slice(0, 1).toString("hex"));
            }
        });

        return true;
    }
}

module.exports = BatchPacket;