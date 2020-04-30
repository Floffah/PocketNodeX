const BinaryStream = require("../NetworkBinaryStream");
const Vector3 = require("../../../math/Vector3");

const Attribute = require("../../../entity/Attribute");

class DataPacket extends BinaryStream {

    /** @type {boolean} */
    isEncoded = false;

    static getId() {
        return 0;
    }

    getId() {
        return this.constructor.getId();
    }

    getName() {
        return this.constructor.name;
    }

    canBeBatched() {
        return true;
    }

    canBeSentBeforeLogin() {
        return false;
    }

    mayHaveUnreadBytes() {
        return false;
    }

    clean() {
        this.isEncoded = false;
        super.reset();
    }

    decode() {
        this.offset = 0;
        this._decodeHeader();
        this._decodePayload();
    }

    _decodeHeader() {
        let pid = this.readUnsignedVarInt();
        if (pid !== this.getId()) {
            console.log(`Expected " . ${this.getId()} . " for packet ID, got ${pid}`);
        }
    }

    _decodePayload() {
    }

    encode() {
        this.reset();
        this._encodeHeader();
        this._encodePayload();
        this.isEncoded = true;
    }

    _encodeHeader() {
        this.writeUnsignedVarInt(this.getId());
    }

    _encodePayload() {
    }

    getBuffer() {
        return this.buffer;
    }

    handle(session) {
        return false;
    }
}

module.exports = DataPacket;