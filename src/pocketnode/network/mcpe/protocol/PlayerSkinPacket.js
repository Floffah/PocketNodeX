const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

const SkinAnimation = require("../../../utils/SkinAnimation");
const Skin = require("../../../entity/Skin");

"use strict";

class PlayerSkinPacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.PLAYER_SKIN_PACKET;

    // TODO: type

    uuid;
    skin;

    _decodePayload() {
        this.uuid = this.readUUID();

        let [skinId, skinResourcePatch, skinData] = [this.readString(), this.readString(), this.getImage()];
        let animations = [];
        for (let i = 0; i < this.readLInt(); i++) {
            animations.push(new SkinAnimation(this.getImage(), this.readLInt(), this.readLFloat()));
        }
        let [capeData, geometryData, animationData, premium, persona, capeOnClassic, capeId, fullSkinId] = [this.getImage(), this.readString(), this.readString(), this.readBool(), this.readBool(), this.readBool(), this.readString(), this.readString()];

        this.skin = new Skin(
            skinId, skinResourcePatch, skinData, animations, capeData, geometryData, animationData, premium, persona, capeOnClassic, capeId
        );
    }

    _encodePayload() {
        this.writeUUID(this.uuid);

        this.writeString(this.skin.getSkinId());
        this.writeString(this.skin.getSkinResourcePatch());
        this.putImage(this.skin.getSkinData());
        this.writeLInt(this.skin.getAnimations().length);
        this.skin.getAnimations().forEach(animation => {
            this.putImage(animation.getImage());
            this.writeLInt(animation.getType());
            this.writeLFloat(animation.getFrames());
        });
        this.putImage(this.skin.getCapeData());
        this.writeString(this.skin.getGeometryData());
        this.writeString(this.skin.getAnimationData());
        this.writeBool(this.skin.getPremium());
        this.writeBool(this.skin.getPersona());
        this.writeBool(this.skin.getCapeOnClassic());
        this.writeString(this.skin.getCapeId());
        this.writeString(this.skin.getFullSkinId());
    }

    handle(session) {
        return session.handlePlayerSkin(this);
    }
}

module.exports = PlayerSkinPacket;