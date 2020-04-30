const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

class ServerToClientHandshakePacket extends DataPacket {
    static getId() {
        return ProtocolInfo.SERVER_TO_CLIENT_HANDSHAKE_PACKET;
    }

    /** @type {string} */
    jwt;

    canBeSentBeforeLogin() {
        return true;
    }

    _decodePayload() {
        this.jwt = this.readString();
    }

    _encodePayload() {
        this.writeString(this.jwt);
    }

    handle(session) {
        return session.handleServerToClientHandshake(this);
    }
}

module.exports = ServerToClientHandshakePacket;