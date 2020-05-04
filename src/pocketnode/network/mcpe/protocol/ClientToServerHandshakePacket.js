const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

"use strict";

class ClientToServerHandshakePacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.CLIENT_TO_SERVER_HANDSHAKE_PACKET;

    allowBeforeLogin = true;

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