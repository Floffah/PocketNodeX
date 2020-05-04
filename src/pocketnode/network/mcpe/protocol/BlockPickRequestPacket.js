const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

"use strict";

class BlockPickRequestPacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.BLOCK_PICK_REQUEST_PACKET;

    /** @type {number} */
    blockX;
    /** @type {number} */
    blockY;
    /** @type {number} */
    blockZ;

    /** @type {boolean} */
    addUserData = false;
    /** @type {number} */
    hotbarSlot;

    _decodePayload() {
        this.readSignedBlockPosition(this.blockX, this.blockY, this.blockZ);
        this.addUserData = this.readBool();
        this.hotbarSlot = this.readByte();
    }

    _encodePayload() {
        this.writeSignedBlockPosition(this.blockX, this.blockY, this.blockZ);
        this.writeBool(this.addUserData);
        this.writeByte(this.hotbarSlot);
    }

    handle(session) {
        return session.handleBlockPickRequest(this);
    }
}

module.exports = BlockPickRequestPacket;