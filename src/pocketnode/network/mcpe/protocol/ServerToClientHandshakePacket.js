const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

"use strict";

class ServerToClientHandshakePacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.SERVER_TO_CLIENT_HANDSHAKE_PACKET;

    /** @type {string} */
    jwt;

    allowBeforeLogin = true;

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