const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

"use strict";

class MobEffectPacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.MOB_EFFECT_PACKET;

    static get EVENT_ADD() {
        return 1
    };

    static get EVENT_MODIFY() {
        return 2
    };

    static get EVENT_REMOVE() {
        return 3
    };

    /** @type {number} */
    entityRuntimeId;
    /** @type {number} */
    eventId;
    /** @type {number} */
    effectId;
    /** @type {number} */
    amplifier = 0;
    /** @type {boolean} */
    particles = true;
    /** @type {number} */
    duration = 0;

    _decodePayload() {
        this.entityRuntimeId = this.readEntityRuntimeId();
        this.eventId = this.readByte();
        this.effectId = this.readVarInt();
        this.amplifier = this.readVarInt();
        this.particles = this.readBool();
        this.duration = this.readVarInt();
    }

    _encodePayload() {
        this.writeEntityRuntimeId(this.entityRuntimeId);
        this.writeByte(this.eventId);
        this.writeVarInt(this.effectId);
        this.writeVarInt(this.amplifier);
        this.writeBool(this.particles);
        this.writeVarInt(this.duration);
    }

    handle(session) {
        return session.handleMobEffect(this);
    }
}

module.exports = MobEffectPacket;