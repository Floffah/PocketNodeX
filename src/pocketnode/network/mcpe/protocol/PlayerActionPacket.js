const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

"use strict";

class PlayerActionPacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.PLAYER_ACTION_PACKET;

    static get ACTION_START_BREAK() {
        return 0
    };

    static get ACTION_ABORT_BREAK() {
        return 1
    };

    static get ACTION_STOP_BREAK() {
        return 2
    };

    static get ACTION_GET_UPDATED_BLOCK() {
        return 3
    };

    static get ACTION_DROP_ITEM() {
        return 4
    };

    static get ACTION_START_SLEEPING() {
        return 5
    };

    static get ACTION_STOP_SLEEPING() {
        return 6
    };

    static get ACTION_RESPAWN() {
        return 7
    };

    static get ACTION_JUMP() {
        return 8
    };

    static get ACTION_START_SPRINT() {
        return 9
    };

    static get ACTION_STOP_SPRINT() {
        return 10
    };

    static get ACTION_START_SNEAK() {
        return 11
    };

    static get ACTION_STOP_SNEAK() {
        return 12
    };

    static get ACTION_DIMENSION_CHANGE_REQUEST() {
        return 13
    }; //sent when dying in different dimension
    static get ACTION_DIMENSION_CHANGE_ACK() {
        return 14
    }; //sent when spawning in a different dimension to tell the server we spawned
    static get ACTION_START_GLIDE() {
        return 15
    };

    static get ACTION_STOP_GLIDE() {
        return 16
    };

    static get ACTION_BUILD_DENIED() {
        return 17
    };

    static get ACTION_CONTINUE_BREAK() {
        return 18
    };

    static get ACTION_SET_ENCHANTMENT_SEED() {
        return 20
    };

    static get ACTION_START_SWIMMING() {
        return 21
    };

    static get ACTION_STOP_SWIMMING() {
        return 22
    };

    static get ACTION_START_SPIN_ATTACK() {
        return 23
    };

    static get ACTION_STOP_SPIN_ATTACK() {
        return 24
    };

    static get ACTION_INTERACT_BLOCK() {
        return 25
    };

    /** @type {number} */
    entityRuntimeId;
    /** @type {number} */
    action;

    /** @type {number} */
    x;
    /** @type {number} */
    y;
    /** @type {number} */
    z;
    /** @type {number} */
    face;

    _decodePayload() {
        this.entityRuntimeId = this.readEntityRuntimeId();
        this.action = this.readVarInt();
        this.readBlockPosition(this.x, this.y, this.z);
        this.face = this.readVarInt();
    }

    _encodePayload() {
        this.writeEntityRuntimeId(this.entityRuntimeId);
        this.writeVarInt(this.action);
        this.writeBlockPosition(this.x, this.y, this.z);
        this.writeVarInt(this.face);
    }

    handle(session) {
        return session.handlePlayerAction(this);
    }
}

module.exports = PlayerActionPacket;