const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

"use strict";

class CommandRequestPacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.COMMAND_REQUEST_PACKET;

    /** @type {string} */
    command;
    /** @type {any} */
    originData;
    /** @type {boolean} */
    isInternal = false;

    _decodePayload() {
        this.command = this.readString();
        this.originData = this.getCommandOriginData();
        this.isInternal = this.readBool();
    }

    _encodePayload() {
        this.writeString(this.command);
        this.putCommandOriginData(this.originData);
        this.writeBool(this.isInternal);
    }

    handle(session) {
        return session.handleCommandRequest(this);
    }
}

module.exports = CommandRequestPacket;