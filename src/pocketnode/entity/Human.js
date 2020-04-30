// const Many = require("extends-classes");

const Creature = require("./Creature");
const ProjectileSource = require("./projectile/ProjectileSource");
const InventoryHolder = require("../inventory/InventoryHolder");
const Skin = require("./Skin");
const Player = require("../player/Player");
const PlayerSkinPacket = require("../network/mcpe/protocol/PlayerSkinPacket");
const UUID = require("../utils/UUID");
const Level = require("../level/Level");
const Entity = require('../entity/Entity');

class Human extends Entity {

    //TODO: replace Server with level
    /**
     * @param server
     */
    constructor(server) {
        super(server);

        // if (this._skin === null) {
        //     let skinTag = nbt.getCompoundTag("Skin");
        //     if (skinTag === null) {
        //         console.log("Human must have a valid skin set");
        //     }
        //     this._skin = self.deserializeSkinNBT(skinTag);
        // }

    }

    // static deserializeSkinNBT(skinTag) {
    //     let skin = new Skin(
    //         skinTag.getString("Name"),
    //         skinTag.hasTag("Data", StringTag) ? skinTag.getString("Data") : skinTag.getByteArray("Data"),
    //         skinTag.getByteArray("CapeData", ""),
    //         skinTag.getString("GeometryName", ""),
    //         skinTag.getByteArray("GeometryData", "")
    //     );
    //     skin.validate();
    //     return skin;
    // }

    initVars() {

        this._inventory = null;
        this._enderChestInventory = null;

        this._uuid = null;
        this._rawUUID = null;

        this.width = 0.6;
        this.height = 1.8;
        this.eyeHeight = 1.62;

        this._skin = null;

        this._foodTickTimer = 0;

        this._totalXp = 0;
        this._xpSeed = 0;
        this._xpCooldown = 0;

        this._baseOffset = 1.62;
    }

    __call(method, args) {
        //console.log(`'${method}()' is missing!`);
    }

    /**
     * @return {UUID|null}
     */
    getUniqueId() {
        return this._uuid;
    }

    /**
     * @returns {string}
     */
    getRawUniqueId() {
        return this._rawUUID;
    }

    /**
     * Returns a Skin object containing information about this human's skin.
     * @returns {Skin}
     */
    getSkin() {
        return this._skin;
    }

    /**
     * Sets the human's skin. This will not send any update to viewers, you need to do that manually using
     *
     * @param skin {Skin}
     */
    setSkin(skin) {
        skin.validate();
        this._skin = skin;
        this._skin.debloatGeometryData();
    }

    /**
     * Sends the human's skin to the specified list of players. If null is given for targets, the skin will be sent to
     * all viewers.
     *
     * @param targets {Player[]|null}
     */
    sendSkin(targets = null) {
        let pk = new PlayerSkinPacket();
        pk.uuid = this.getUniqueId();
        pk.skin = this._skin;
        this.server.broadcastPackets(pk, targets)
        // this.server.broadcastPackets(pk, targets || this.hasSpawned)
    }

    jump() {
        super.jump();
        if (this.isSprinting()) {
            //TODO
        }
    }

    getFood() {
        //TODO: attribute map
    }

}

module.exports = Human;