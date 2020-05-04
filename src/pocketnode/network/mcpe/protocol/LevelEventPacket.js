const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

"use strict";

class LevelEventPacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.LEVEL_EVENT_PACKET;

    static get EVENT_SOUND_CLICK() {
        return 1000
    };

    static get EVENT_SOUND_CLICK_FAIL() {
        return 1001
    };

    static get EVENT_SOUND_SHOOT() {
        return 1002
    };

    static get EVENT_SOUND_DOOR() {
        return 1003
    };

    static get EVENT_SOUND_FIZZ() {
        return 1004
    };

    static get EVENT_SOUND_IGNITE() {
        return 1005
    };

    static get EVENT_SOUND_GHAST() {
        return 1007
    };

    static get EVENT_SOUND_GHAST_SHOOT() {
        return 1008
    };

    static get EVENT_SOUND_BLAZE_SHOOT() {
        return 1009
    };

    static get EVENT_SOUND_DOOR_BUMP() {
        return 1010
    };

    static get EVENT_SOUND_DOOR_CRASH() {
        return 1012
    };

    static get EVENT_SOUND_ENDERMAN_TELEPORT() {
        return 1018
    };

    static get EVENT_SOUND_ANVIL_BREAK() {
        return 1020
    };

    static get EVENT_SOUND_ANVIL_USE() {
        return 1021
    };

    static get EVENT_SOUND_ANVIL_FALL() {
        return 1022
    };

    static get EVENT_SOUND_POP() {
        return 1030
    };

    static get EVENT_SOUND_PORTAL() {
        return 1032
    };

    static get EVENT_SOUND_ITEMFRAME_ADD_ITEM() {
        return 1040
    };

    static get EVENT_SOUND_ITEMFRAME_REMOVE() {
        return 1041
    };

    static get EVENT_SOUND_ITEMFRAME_PLACE() {
        return 1042
    };

    static get EVENT_SOUND_ITEMFRAME_REMOVE_ITEM() {
        return 1043
    };

    static get EVENT_SOUND_ITEMFRAME_ROTATE_ITEM() {
        return 1044
    };

    static get EVENT_SOUND_CAMERA() {
        return 1050
    };

    static get EVENT_SOUND_ORB() {
        return 1051
    };

    static get EVENT_SOUND_TOTEM() {
        return 1052
    };

    static get EVENT_SOUND_ARMOR_STAND_BREAK() {
        return 1060
    };

    static get EVENT_SOUND_ARMOR_STAND_HIT() {
        return 1061
    };

    static get EVENT_SOUND_ARMOR_STAND_FALL() {
        return 1062
    };

    static get EVENT_SOUND_ARMOR_STAND_PLACE() {
        return 1063
    };

    //TODO: check 2000-2017
    static get EVENT_PARTICLE_SHOOT() {
        return 2000
    };

    static get EVENT_PARTICLE_DESTROY() {
        return 2001
    };

    static get EVENT_PARTICLE_SPLASH() {
        return 2002
    };

    static get EVENT_PARTICLE_EYE_DESPAWN() {
        return 2003
    };

    static get EVENT_PARTICLE_SPAWN() {
        return 2004
    };

    static get EVENT_GUARDIAN_CURSE() {
        return 2006
    };

    static get EVENT_PARTICLE_BLOCK_FORCE_FIELD() {
        return 2008
    };

    static get EVENT_PARTICLE_PROJECTILE_HIT() {
        return 2009
    };

    static get EVENT_PARTICLE_ENDERMAN_TELEPORT() {
        return 2013
    };

    static get EVENT_PARTICLE_PUNCH_BLOCK() {
        return 2014
    };

    static get EVENT_START_RAIN() {
        return 3001
    };

    static get EVENT_START_THUNDER() {
        return 3002
    };

    static get EVENT_STOP_RAIN() {
        return 3003
    };

    static get EVENT_STOP_THUNDER() {
        return 3004
    };

    static get EVENT_PAUSE_GAME() {
        return 3005
    }; //data: 1 to pause, 0 to resume
    static get EVENT_PAUSE_GAME_NO_SCREEN() {
        return 3006
    }; //data: 1 to pause, 0 to resume - same effect as normal pause but without screen
    static get EVENT_SET_GAME_SPEED() {
        return 3007
    }; //x coordinate of pos() {returnscale factor (default 1.0)

    static get EVENT_REDSTONE_TRIGGER() {
        return 3500
    };

    static get EVENT_CAULDRON_EXPLODE() {
        return 3501
    };

    static get EVENT_CAULDRON_DYE_ARMOR() {
        return 3502
    };

    static get EVENT_CAULDRON_CLEAN_ARMOR() {
        return 3503
    };

    static get EVENT_CAULDRON_FILL_POTION() {
        return 3504
    };

    static get EVENT_CAULDRON_TAKE_POTION() {
        return 3505
    };

    static get EVENT_CAULDRON_FILL_WATER() {
        return 3506
    };

    static get EVENT_CAULDRON_TAKE_WATER() {
        return 3507
    };

    static get EVENT_CAULDRON_ADD_DYE() {
        return 3508
    };

    static get EVENT_CAULDRON_CLEAN_BANNER() {
        return 3509
    };

    static get EVENT_BLOCK_START_BREAK() {
        return 3600
    };

    static get EVENT_BLOCK_STOP_BREAK() {
        return 3601
    };

    static get EVENT_SET_DATA() {
        return 4000
    };

    static get EVENT_PLAYERS_SLEEPING() {
        return 9800
    };

    static get EVENT_ADD_PARTICLE_MASK() {
        return 0x4000
    };

    /** @type {number} */
    evid;
    /** @type {any} */
    position;
    /** @type {number} */
    data;

    _decodePayload() {
        this.evid = this.readVarInt();
        this.position = this.readVector3();
        this.data = this.readVector3();
    }

    _encodePayload() {
        this.writeVarInt(this.evid);
        this.writeVector3(this.position);  // nullable
        this.writeVarInt(this.data);
    }

    handle(session) {
        session.handleLevelEvent(this);
    }
}

module.exports = LevelEventPacket;