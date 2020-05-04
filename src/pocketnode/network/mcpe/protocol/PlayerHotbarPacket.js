const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

"use strict";

class PlayerHotbarPacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.PLAYER_HOTBAR_PACKET;

    _decodePayload() {

    }

    _encodePayload() {

    }
}

module.exports = PlayerHotbarPacket;