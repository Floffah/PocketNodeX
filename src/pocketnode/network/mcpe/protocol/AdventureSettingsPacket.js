const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

"use strict";

class AdventureSettingsPacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.ADVENTURE_SETTINGS_PACKET;

    static get PERMISSION_NORMAL() {
        return 0
    };

    static get PERMISSION_OPERATOR() {
        return 1
    };

    static get PERMISSION_HOST() {
        return 2
    };

    static get PERMISSION_AUTOMATION() {
        return 3
    };

    static get PERMISSION_ADMIN() {
        return 4
    };

    /**
     * This constant is used to identify flags that should be set on the second field. In a sensible world, these
     * flags would all be set on the same packet field, but as of MCPE 1.2, the new abilities flags have for some
     * reason been assigned a separate field.
     */
    static get BITFLAG_SECOND_SET() {
        return 1 << 16
    };

    static get WORLD_IMMUTABLE() {
        return 0x01
    };

    static get NO_PVP() {
        return 0x02
    };

    static get AUTO_JUMP() {
        return 0x20
    };

    static get ALLOW_FLIGHT() {
        return 0x40
    };

    static get NO_CLIP() {
        return 0x80
    };

    static get WORLD_BUILDER() {
        return 0x100
    };

    static get FLYING() {
        return 0x200
    };

    static get MUTED() {
        return 0x400
    };

    static get BUILD_AND_MINE() {
        return 0x01 | this.BITFLAG_SECOND_SET
    };

    static get DOORS_AND_SWITCHES() {
        return 0x02 | this.BITFLAG_SECOND_SET
    };

    static get OPEN_CONTAINERS() {
        return 0x04 | this.BITFLAG_SECOND_SET
    };

    static get ATTACK_PLAYERS() {
        return 0x08 | this.BITFLAG_SECOND_SET
    };

    static get ATTACK_MOBS() {
        return 0x10 | this.BITFLAG_SECOND_SET
    };

    static get OPERATOR() {
        return 0x20 | this.BITFLAG_SECOND_SET
    };

    static get TELEPORT() {
        return 0x80 | this.BITFLAG_SECOND_SET
    };

    /** @type {number} */
    flags = 0;
    /** @type {number} */
    commandPermission = AdventureSettingsPacket.PERMISSION_NORMAL;
    /** @type {number} */
    flags2;
    /** @type {number} */
    playerPermission = 0;
    /** @type {number} */
    customFlags = 0;
    /** @type {number} */
    entityUniqueId;

    _decodePayload() {
        this.flags = this.readUnsignedVarInt();
        this.commandPermission = this.readUnsignedVarInt();
        this.flags2 = this.readUnsignedVarInt();
        this.playerPermission = this.readUnsignedVarInt();
        this.customFlags = this.readUnsignedVarInt();
        this.entityUniqueId = this.readLLong();
    }

    _encodePayload() {
        this.writeUnsignedVarInt(this.flags);
        this.writeUnsignedVarInt(this.commandPermission);
        this.writeUnsignedVarInt(this.flags2);
        this.writeUnsignedVarInt(this.playerPermission);
        this.writeUnsignedVarInt(this.customFlags);
        this.writeLLong(this.entityUniqueId);
    }

    getFlag(flag) {
        CheckTypes([Number, flag]);
        if (flag & AdventureSettingsPacket.BITFLAG_SECOND_SET) {
            return (this.flags2 & flag) !== 0;
        }
    }

    setFlag(flag, value) {
        CheckTypes([Number, flag], [Boolean, value]);
        let flagSet;
        if (flag & AdventureSettingsPacket.BITFLAG_SECOND_SET) {
            flagSet = flagSet & this.flags2;
        } else {
            flagSet = flagSet & this.flags;
        }

        if (value) {
            flagSet |= flag;
        } else {
            flagSet = flagSet & ~flag;
        }
    }

    handle(session) {
        return session.handleAdventureSettings(this);
    }

}

module.exports = AdventureSettingsPacket;