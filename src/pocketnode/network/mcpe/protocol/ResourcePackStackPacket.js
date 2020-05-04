const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

"use strict";

class ResourcePackStackPacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.RESOURCE_PACK_STACK_PACKET;

    /** @type {boolean} */
    mustAccept = false;

    /** @type {any} */
    behaviorPackStack = [];
    /** @type {any} */
    resourcePackStack = [];

    /** @type {boolean} */
    isExperimental = false;
    /** @type {string} */
    baseGameVersion = ProtocolInfo.VERSION;

    _decodePayload() {
        this.mustAccept = this.readBool();
        let behaviorPackCount = this.readUnsignedVarInt();
        while (behaviorPackCount-- > 0) {
            this.readString();
            this.readString();
            this.readString();
        }

        let resourcePackCount = this.readUnsignedVarInt();
        while (resourcePackCount-- > 0) {
            this.readString();
            this.readString();
            this.readString();
        }

        this.isExperimental = this.readBool();
        this.baseGameVersion = this.readString();
    }

    _encodePayload() {
        this.writeBool(this.mustAccept);

        this.writeUnsignedVarInt(this.behaviorPackStack.length);
        this.behaviorPackStack.forEach(entry => {
            this.writeString(entry.getPackId());
            this.writeString(entry.getPackVersion());
            this.writeString("");
        });

        this.writeUnsignedVarInt(this.resourcePackStack.length);
        this.resourcePackStack.forEach(entry => {
            this.writeString(entry.getPackId());
            this.writeString(entry.getPackVersion());
            this.writeString("");
        });

        this.writeBool(this.isExperimental);
        this.writeString(this.baseGameVersion);
    }
}

module.exports = ResourcePackStackPacket;