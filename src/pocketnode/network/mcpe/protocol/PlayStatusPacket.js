const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

class PlayStatusPacket extends DataPacket {
    static getId() {
        return ProtocolInfo.PLAY_STATUS_PACKET;
    }

    /** @type {number} */
    status;

    static get LOGIN_SUCCESS() {
        return 0
    }

    static get LOGIN_FAILED_CLIENT() {
        return 1
    }

    static get LOGIN_FAILED_SERVER() {
        return 2
    }

    static get PLAYER_SPAWN() {
        return 3
    }

    static get LOGIN_FAILED_INVALID_TENANT() {
        return 4
    }

    static get LOGIN_FAILED_VANILLA_EDU() {
        return 5
    }

    static get LOGIN_FAILED_EDU_VANILLA() {
        return 6
    }

    canBeSentBeforeLogin() {
        return true;
    }

    _decodePayload() {
        this.status = this.readInt();
    }

    _encodePayload() {
        this.writeInt(this.status);
    }

    handle(session) {
        return session.handlePlayStatus(this);
    }
}

module.exports = PlayStatusPacket;