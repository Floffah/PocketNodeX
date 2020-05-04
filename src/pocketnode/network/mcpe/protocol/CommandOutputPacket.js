const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");
const CommandOutputMessage = require("./types/CommandOutputMessage");

"use strict";

class CommandOutputPacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.COMMAND_OUTPUT_PACKET;

    /** @type {any} */
    originData;
    /** @type {number} */
    outputType;
    /** @type {number} */
    successCount;
    /** @type {any} */
    messages;
    /** @type {string} */
    unknownString;

    _decodePayload() {
        this.originData = this.getCommandOriginData();
        this.outputType = this.readByte();
        this.successCount = this.readUnsignedVarInt();

        for (let i = 0, size = this.readUnsignedVarInt(); i < size; ++i) {
            this.messages = this.getCommandMessage();
        }

        if (this.outputType === 4) {
            this.unknownString = this.readString();
        }
    }

    getCommandMessage() {
        let message = new CommandOutputMessage();
        message.isInternal = this.readBool();
        message.messageId = this.readString();
        for (let i = 0, size = this.readUnsignedVarInt(); i < size; ++i) {
            message.parameters.push(this.readString());
        }
        return message;
    }

    _encodePayload() {
        this.putCommandOriginData(this.originData);
        this.writeByte(this.outputType);
        this.writeUnsignedVarInt(this.successCount);

        this.writeUnsignedVarInt(this.messages.length);
        this.messages.forEach(message => {
            this.putCommandMessage(message);
        });

        if (this.outputType === 4) {
            this.writeString(this.unknownString);
        }
    }

    putCommandMessage(message) {
        this.writeBool(message.isInternal);
        this.writeString(message.messageId);

        this.writeUnsignedVarInt(message.parameters.length);
        this.messages.parameters.forEach(parameter => {
            this.writeString(parameter);
        });
    }

    handle(session) {
        return session.handleCommandOutput(this);
    }
}

module.exports = CommandOutputPacket;