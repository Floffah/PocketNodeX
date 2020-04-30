const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

class PlayerHotbarPacket extends DataPacket {

    static getId() {
        return ProtocolInfo.PLAYER_ACTION_PACKET;
    }

    _decodePayload() {

    }

    _encodePayload() {

    }
}

module.exports = PlayerHotbarPacket;