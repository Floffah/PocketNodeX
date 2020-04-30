const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");
const ScoreboardEntry = require("./types/ScoreboardIdentityPacketEntry");

class SetScoreboardIdentityPacket extends DataPacket {
    static getId() {
        return ProtocolInfo.SET_SCOREBOARD_IDENTITY_PACKET;
    }

    static TYPE_REGISTER_IDENTITY() {
        return 0;
    }

    static TYPE_CLEAR_IDENTITY() {
        return 1;
    }

    /** @type {any} */
    entries = [];
    /** @type {number} */
    type = 0;

    _decodePayload() {
        this.type = this.readByte();
        let count = this.readUnsignedVarInt();
        for (let i = 0; i < count; i++) {
            let entry = new ScoreboardEntry();
            entry.scoreboardId = this.readVarLong();
            if (this.type === SetScoreboardIdentityPacket.TYPE_REGISTER_IDENTITY()) {
                entry.entityUniqueId = this.getEntityUniqueId();
            }
            this.entries.push(entry);
        }
    }

    _encodePayload() {
        this.writeByte(this.type);
        this.writeUnsignedVarInt(this.entries.length);
        for (let i = 0; i < this.entries.length; i++) {
            let entry = this.entries[i];
            this.writeVarLong(entry.scoreboardId);
            if (this.type === SetScoreboardIdentityPacket.TYPE_REGISTER_IDENTITY()) {
                this.writeEntityUniqueId(entry.entityUniqueId);
            }
        }
    }

    handle(session) {
        return false;
    }
}

module.exports = SetScoreboardIdentityPacket;