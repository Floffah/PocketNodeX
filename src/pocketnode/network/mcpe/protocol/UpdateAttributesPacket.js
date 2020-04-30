const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

class UpdateAttributesPacket extends DataPacket {
    static getId() {
        return ProtocolInfo.UPDATE_ATTRIBUTES_PACKET;
    }

    /** @type {number} */
    entityRuntimeId;
    /** @type {any} */
    entries = [];

    _decodePayload() {
        this.entityRuntimeId = this.readEntityRuntimeId();
        // this.entries = this.readAttributeList();
    }

    _encodePayload() {
        this.writeEntityRuntimeId(this.entityRuntimeId);
        // console.log(this.entries);
        this.writeAttributeList(this.entries);
    }

    handle(session) {
        return session.handleUpdateAttributes(this);
    }
}

module.exports = UpdateAttributesPacket;