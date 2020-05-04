const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

"use strict";

class UpdateSoftEnumPacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.UPDATE_SOFT_ENUM_PACKET;

    /** @type {string} */
    enumName = "";
    /** @type {any} */
    values = [];
    /** @type {number} */
    type = 0;

    _decodePayload() {
        this.enumName = this.readString();
        let count = this.readUnsignedVarInt();
        for (let i = 0; i < count; i++) {
            this.values.push(this.readString());
        }
        this.type = this.readByte();
    }

    _encodePayload() {
        this.writeString(this.enumName);
        this.writeUnsignedVarInt(this.values.length);
        this.values.forEach(value => {
            this.writeString(value);
        });
        this.writeByte(this.type);
    }

    handle(session) {
        return false;
    }
}

module.exports = UpdateSoftEnumPacket;