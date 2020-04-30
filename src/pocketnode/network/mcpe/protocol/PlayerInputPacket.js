const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

class PlayerInputPacket extends DataPacket {
    static getId() {
        return ProtocolInfo.PLAYER_INPUT_PACKET;
    }

    /** @type {number} */
    motionX;
    /** @type {number} */
    motionY;

    /** @type {boolean} */
    isJumping = false;
    /** @type {boolean} */
    isSneaking = false;

    _decodePayload() {
        this.motionX = this.readLFloat();
        this.motionY = this.readLFloat();
        this.isJumping = this.readBool();
        this.isSneaking = this.readBool();
    }

    _encodePayload() {
        this.writeLFloat(this.motionX);
        this.writeLFloat(this.motionY);
        this.writeBool(this.isJumping);
        this.writeBool(this.isSneaking);
    }

    handle(session) {
        return session.handlePlayerInput(this);
    }
}

module.exports = PlayerInputPacket;