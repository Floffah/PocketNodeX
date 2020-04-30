const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

class SetDefaultGameTypePacket extends DataPacket {
    static getId() {
        return ProtocolInfo.SET_DEFAULT_GAME_TYPE_PACKET;
    }

    /** @type {number} */
    gamemode = 0;

    _decodePayload() {
        this.gamemode = this.readVarInt();
    }

    _encodePayload() {
        this.writeUnsignedVarInt(this.gamemode);
    }

    handle(session) {
        return session.handleSetDefaultGameType(this);
    }
}

module.exports = SetDefaultGameTypePacket;