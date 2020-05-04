const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

"use strict";

class TextPacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.TEXT_PACKET;

    static get TYPE_RAW() {
        return 0
    }

    static get TYPE_CHAT() {
        return 1
    }

    static get TYPE_TRANSLATION() {
        return 2
    }

    static get TYPE_POPUP() {
        return 3
    }

    static get TYPE_JUKEBOX_POPUP() {
        return 4
    }

    static get TYPE_TIP() {
        return 5
    }

    static get TYPE_SYSTEM() {
        return 6
    }

    static get TYPE_WHISPER() {
        return 7
    }

    static get TYPE_ANNOUNCEMENT() {
        return 8
    }

    static get TYPE_JSON() {
        return 9
    }

    /** @type {number} */
    type;
    /** @type {boolean} */
    needsTranslation = false;
    /** @type {string} */
    sourceName = "";
    /** @type {string} */
    message = "";
    /** @type {any} */
    parameters = [];
    /** @type {string} */
    xboxUserId = "";
    /** @type {string} */
    platformChatId = "";

    _decodePayload() {
        this.type = this.readByte();
        this.needsTranslation = this.readBool();
        switch (this.type) {
            case TextPacket.TYPE_CHAT:
            case TextPacket.TYPE_WHISPER:
            case TextPacket.TYPE_ANNOUNCEMENT:
                this.sourceName = this.readString();
            case TextPacket.TYPE_RAW:
            case TextPacket.TYPE_TIP:
            case TextPacket.TYPE_SYSTEM:
            case TextPacket.TYPE_JSON:
                this.message = this.readString();
                break;
            case TextPacket.TYPE_TRANSLATION:
            case TextPacket.TYPE_POPUP:
            case TextPacket.TYPE_JUKEBOX_POPUP:
                this.message = this.readString();
                let count = this.readUnsignedVarInt();
                for (let i = 0; i < count; ++i) {
                    this.parameters.push(this.readString());
                }
                break;
        }

        this.xboxUserId = this.readString();
        this.platformChatId = this.readString();
    }

    _encodePayload() {
        this.writeByte(this.type);
        this.writeBool(this.needsTranslation);
        switch (this.type) {
            case TextPacket.TYPE_CHAT:
            case TextPacket.TYPE_WHISPER:
            case TextPacket.TYPE_ANNOUNCEMENT:
                this.writeString(this.sourceName);
            case TextPacket.TYPE_RAW:
            case TextPacket.TYPE_TIP:
            case TextPacket.TYPE_SYSTEM:
            case TextPacket.TYPE_JSON:
                this.writeString(this.message);
                break;
            case TextPacket.TYPE_TRANSLATION:
            case TextPacket.TYPE_POPUP:
            case TextPacket.TYPE_JUKEBOX_POPUP:
                this.writeString(this.message);
                this.writeUnsignedVarInt(this.parameters.length);
                this.parameters.forEach(p => this.writeString(p));
                break;
        }

        this.writeString(this.xboxUserId);
        this.writeString(this.platformChatId);
    }

    handle(session) {
        return session.handleText(this);
    }
}

module.exports = TextPacket;