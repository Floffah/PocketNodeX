const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

"use strict";

class SetPlayerGameTypePacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.SET_PLAYER_GAME_TYPE_PACKET;

    /** @type {number} */
    gamemode = 0;

    _decodePayload() {
        this.gamemode = this.readVarInt();
    }

    _encodePayload() {
        this.writeVarInt(this.gamemode);
    }

    handle(session) {
        return session.handleSetPlayerGameType(this);
    }

}

module.exports = SetPlayerGameTypePacket;