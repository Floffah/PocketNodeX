const Position = require("../level/Position");
const BlockIds = require("./BlockIds");
const RuntimeBlockMapping = require("../network/mcpe/protocol/types/RuntimeBlockMapping");
const Vector3 = require("../math/Vector3");
const Player = require("../player/Player");
const Item = require("../item/Item");

class Block extends multiple(Position, BlockIds) {

    constructor(id, meta = 0, name = null, itemId = null) {
        super();
        this._id = id;
        this._meta = meta;
        this._fallbackName = name;
        this._itemId = itemId;
    }

    initVars() {
        this._id = -1;
        this._meta = 0;
        this._fallbackName = "";
        this._itemId = -1;

        this._boundingBox = null;

        this._collisionBoxes = null;
    }

    /**
     * @return {string}
     */
    getName() {
        return this._fallbackName || "Unknown";
    }

    /**
     * @return {number}
     */
    getId() {
        return this._id;
    }

    /**
     * Returns the ID of the item form of the block.
     * Used for drops for blocks (some blocks such as doors have a different item ID).
     *
     * @return {number}
     */
    getItemId() {
        return this._itemId || this.getId();
    }

    /**
     * @return {number}
     */
    getRuntimeId() {
        //TODO: return RuntimeBlockMapping.to
    }

    /**
     * @return {number}
     */
    getDamage() {
        return this._meta;
    }

    setDamage(meta) {
        if (meta < 0 || meta > 0xf) {
            console.log(`Block damage values must be 0-15, not ${meta}`);
        }
        this._meta = meta;
    }

    /**
     * Bitmask to use to remove superfluous information from block meta when getting its item form or name.
     * This defaults to -1 (don't remove any data). Used to remove rotation data and bitflags from block drops.
     *
     * If your block should not have any meta value when it's dropped as an item, override this to return 0 in
     * descendent classes.
     *
     * @return {number}
     */
    getVariantBitmask() {
        return -1;
    }

    /**
     * Returns the block meta, stripped of non-variant flags.
     * @return {number}
     */
    getVariant() {
        return this._meta & this.getVariantBitmask();
    }

    /**
     * AKA: Block->isPlaceable
     * @return {boolean}
     */
    canBePlaced() {
        return true;
    }

    /**
     * @return {boolean}
     */
    canBeReplaced() {
        return false;
    }

    /**
     * @param blockReplace {Block}
     * @param clickVector {Vector3}
     * @param face {number}
     * @param isClickedBlock {boolean}
     * @return {boolean}
     */
    canBePlacedAt(blockReplace, clickVector, face, isClickedBlock) {
        return blockReplace.canBeReplaced();
    }

    /**
     * Places the Block, using block space and block target, and side. Returns if the block has been placed.
     *
     * @param item {Item}
     * @param blockReplace {Block}
     * @param blockClicked {Block}
     * @param face {number}
     * @param clickVector {Vector3}
     * @param player {Player}
     * @return {boolean}
     */
    place(item, blockReplace, blockClicked, face, clickVector, player = null) {
        return this.getLevel().setBlock(this, this, true, true);
    }

    /**
     * Sets the block position to a new Position object
     *
     * @param v {Position}
     */
    position(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.level = v.level;
        this._boundingBox = null;
    }

    /**
     * Clears any cached precomputed objects, such as bounding boxes. This is called on block neighbour update and when
     * the block is set into the world to remove any outdated precomputed things such as AABBs and force recalculation.
     */
    clearCaches() {
        this._boundingBox = null;
        this._collisionBoxes = null;
    }

}

module.exports = Block;