const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

"use strict";

class SubClientLoginPacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.SUB_CLIENT_LOGIN_PACKET;

    /** @type {string} */
    connectionRequestData = "";

    _decodePayload() {
        this.connectionRequestData = this.readString();
    }

    _encodePayload() {
        this.writeString(this.connectionRequestData);
    }

    handle(session) {
        return session.handleSubClientLogin(this);
    }
}

module.exports = SubClientLoginPacket;