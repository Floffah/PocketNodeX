const BinaryStream = require("../NetworkBinaryStream");

"use strict";

class DataPacket extends BinaryStream {
    static PID = 0x00;

    /** @type {boolean} */
    isEncoded = false;

    allowBeforeLogin = false;
    mayHaveUnreadBytes = false;
    allowBatching = true;

    /**
     * @returns {number} - returns packet ID.
     */
    getId() {
        return this.constructor.NETWORK_ID;
    }

    /**
     * @returns {string} - returns packet name.
     */
    getName() {
        return this.constructor.name;
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

    /** @private */
    _decodeHeader() {
        let pid = this.readUnsignedVarInt();
        if (pid !== this.getId()) {
            console.log(`Expected " . ${this.getId()} . " for packet ID, got ${pid}`);
        }
    }

    /** @protected */
    _decodePayload() {}

    encode() {
        this.reset();
        this._encodeHeader();
        this._encodePayload();
        this.isEncoded = true;
    }

    /** @private */
    _encodeHeader() {
        this.writeUnsignedVarInt(this.getId());
    }

    /** @protected */
    _encodePayload() {}

    getBuffer() {
        return this.buffer;
    }

    handle(_session) {
        return false;
    }
}

module.exports = DataPacket;