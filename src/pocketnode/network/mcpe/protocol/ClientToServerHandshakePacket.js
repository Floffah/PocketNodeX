const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

class ClientToServerHandshakePacket extends DataPacket {

    static getId() {
        return ProtocolInfo.CLIENT_TO_SERVER_HANDSHAKE_PACKET;
    }

    canBeSentBeforeLogin() {
        return true;
    }

    _decodePayload() {
        // no payload
    }

    _encodePayload() {
        // no payload
    }

    handle(session) {
        return session.handleClientToServerHandshake(this);
    }
}

module.exports = ClientToServerHandshakePacket;