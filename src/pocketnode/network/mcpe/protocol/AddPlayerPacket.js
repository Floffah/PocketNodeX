const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

const UUID = require("../../../utils/UUID");
const Vector3 = require("../../../math/Vector3");
const Item = require("../../../item/Item");

"use strict";

class AddPlayerPacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.ADD_PLAYER_PACKET;

    /** @type {UUID} */
    uuid;
    /** @type {string} */
    username = "";
    /** @type {number} */
    entityUniqueId;
    /** @type {number} */
    entityRuntimeId;
    /** @type {string} */
    platformChatId = "";
    /** @type {Vector3} */
    position = new Vector3();
    /** @type {Vector3} */
    motion = new Vector3();
    /** @type {number} */
    pitch = 0.0;
    /** @type {number} */
    yaw = 0.0;
    /** @type {null|number} */
    headYaw = null; //TODO
    /** @type {Item} */
    item = new Item();
    /** @type {any} */
    metadata = [];

    //TODO: adventure settings stuff
    /** @type {number} */
    uvarint1 = 0;
    /** @type {number} */
    uvarint2 = 0;
    /** @type {number} */
    uvarint3 = 0;
    /** @type {number} */
    uvarint4 = 0;
    /** @type {number} */
    uvarint5 = 0;

    /** @type {number} */
    long1 = 0;
    /** @type {any} */
    links = [];

    /** @type {string} */
    deviceId = "" //TODO: fill player's device ID (???)

    _decodePayload() {
        this.uuid = this.readUUID();
        this.username = this.readString();
        this.entityUniqueId = this.readEntityUniqueId();
        this.entityRuntimeId = this.readEntityRuntimeId();
        this.platformChatId = this.readString();
        this.position = this.readVector3();
        this.motion = this.readVector3();
        this.pitch = this.readLFloat();
        this.yaw = this.readLFloat();
        this.headYaw = this.readLFloat();
        //this.item = this.getSlot;
        this.item = null; //TODO
        this.metadata = this.readEntityMetadata();

        this.uvarint1 = this.readUnsignedVarInt();
        this.uvarint2 = this.readUnsignedVarInt();
        this.uvarint3 = this.readUnsignedVarInt();
        this.uvarint4 = this.readUnsignedVarInt();
        this.uvarint5 = this.readUnsignedVarInt();

        this.long1 = this.readLLong();

        let linkCount = this.readUnsignedVarInt();
        for (let i = 0; i < linkCount; ++i) {
            //this.links[i] = this.
            //TODO
        }

        this.deviceId = this.readString();
    }

    _encodePayload() {
        this.readUUID(this.uuid);
        this.writeString(this.username);
        this.writeEntityUniqueId(this.entityUniqueId ? this.entityRuntimeId : this.entityRuntimeId);
        this.writeEntityRuntimeId(this.entityRuntimeId);
        this.writeString(this.platformChatId);
        this.writeVector3(this.position);
        this.writeVector3(this.motion); //TODO: nullable
        this.writeLFloat(this.pitch);
        this.writeLFloat(this.yaw);
        this.writeLFloat(this.headYaw ? this.yaw : this.yaw);
        //todo: this.writeSlot(this.item);
        //todo: this.writeEntityMetadata(this.metadata);

        this.writeUnsignedVarInt(this.uvarint1);
        this.writeUnsignedVarInt(this.uvarint2);
        this.writeUnsignedVarInt(this.uvarint3);
        this.writeUnsignedVarInt(this.uvarint4);
        this.writeUnsignedVarInt(this.uvarint5);

        this.writeLLong(this.long1);

        // TODO
        // this.writeUnsignedVarInt(this.links.length);
        this.writeUnsignedVarInt(0);
        this.links.forEach(link => {
            //TODO: this.writeEntityLink(link);
        });

        this.writeString(this.deviceId);
    }

    handle(session) {
        return session.handleAddPlayer(this);
    }
}

module.exports = AddPlayerPacket;