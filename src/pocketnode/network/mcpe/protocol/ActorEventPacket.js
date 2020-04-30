const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

class ActorEventPacket extends DataPacket {
    static getId() {
        return ProtocolInfo.ACTOR_EVENT_PACKET;
    }

    static get HURT_ANIMATION() {
        return 2
    };

    static get DEATH_ANIMATION() {
        return 3
    };

    static get ARM_SWING() {
        return 4
    };

    static get TAME_FAIL() {
        return 6
    };

    static get TAME_SUCCESS() {
        return 7
    };

    static get SHAKE_WET() {
        return 8
    };

    static get USE_ITEM() {
        return 9
    };

    static get EAT_GRASS_ANIMATION() {
        return 10
    };

    static get FISH_HOOK_BUBBLE() {
        return 11
    };

    static get FISH_HOOK_POSITION() {
        return 12
    };

    static get FISH_HOOK_HOOK() {
        return 13
    };

    static get FISH_HOOK_TEASE() {
        return 14
    };

    static get SQUID_INK_CLOUD() {
        return 15
    };

    static get ZOMBIE_VILLAGER_CURE() {
        return 16
    };

    static get RESPAWN() {
        return 18
    };

    static get IRON_GOLEM_OFFER_FLOWER() {
        return 19
    };

    static get IRON_GOLEM_WITHDRAW_FLOWER() {
        return 20
    };

    static get LOVE_PARTICLES() {
        return 21
    }; //breeding

    static get WITCH_SPELL_PARTICLES() {
        return 24
    };

    static get FIREWORK_PARTICLES() {
        return 25
    };

    static get SILVERFISH_SPAWN_ANIMATION() {
        return 27
    };

    static get WITCH_DRINK_POTION() {
        return 29
    };

    static get WITCH_THROW_POTION() {
        return 30
    };

    static get MINECART_TNT_PRIME_FUSE() {
        return 31
    };

    static get PLAYER_ADD_XP_LEVELS() {
        return 34
    };

    static get ELDER_GUARDIAN_CURSE() {
        return 35
    };

    static get AGENT_ARM_SWING() {
        return 36
    };

    static get ENDER_DRAGON_DEATH() {
        return 37
    };

    static get DUST_PARTICLES() {
        return 38
    }; //not sure what this is
    static get ARROW_SHAKE() {
        return 39
    };

    static get EATING_ITEM() {
        return 57
    };

    static get BABY_ANIMAL_FEED() {
        return 60
    }; //green particles, like bonemeal on crops
    static get DEATH_SMOKE_CLOUD() {
        return 61
    };

    static get COMPLETE_TRADE() {
        return 62
    };

    static get REMOVE_LEASH() {
        return 63
    }; //data 1() {return cut leash

    static get CONSUME_TOTEM() {
        return 65
    };

    static get PLAYER_CHECK_TREASURE_HUNTER_ACHIEVEMENT() {
        return 66
    }; //mojang...
    static get ENTITY_SPAWN() {
        return 67
    }; //used for MinecraftEventing stuff, not needed
    static get DRAGON_PUKE() {
        return 68
    }; //they call this puke particles
    static get ITEM_ENTITY_MERGE() {
        return 69
    };

    //TODO: add more events

    /** @type {number} */
    entityRuntimeId;
    /** @type {number} */
    event;
    /** @type {number} */
    data = 0;

    _decodePayload() {
        this.entityRuntimeId = this.readEntityRuntimeId();
        this.event = this.readByte();
        this.data = this.readVarInt();
    }

    _encodePayload() {
        this.writeEntityRuntimeId(this.entityRuntimeId);
        this.writeByte(this.event);
        this.writeVarInt(this.data);
    }

    handle(session) {
        return session.handleActorEvent(this);
    }
}

module.exports = ActorEventPacket;