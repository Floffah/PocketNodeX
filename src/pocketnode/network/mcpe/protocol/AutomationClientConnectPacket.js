const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

"use strict";

class AutomationClientConnectPacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.AUTOMATION_CLIENT_CONNECT_PACKET;

    /** @type {string} */
    serverUri;

    _decodePayload() {
        this.serverUri = this.readString();
    }

    _encodePayload() {
        this.writeString(this.serverUri);
    }

    handle(session) {
        return session.handleAutomationClientConnect(this);
    }
}

module.exports = AutomationClientConnectPacket;