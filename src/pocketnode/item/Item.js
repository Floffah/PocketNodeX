/*
 *   _____           _        _   _   _           _
 *  |  __ \         | |      | | | \ | |         | |
 *  | |__) |__   ___| | _____| |_|  \| | ___   __| | ___
 *  |  ___/ _ \ / __| |/ / _ \ __| . ` |/ _ \ / _` |/ _ \
 *  | |  | (_) | (__|   <  __/ |_| |\  | (_) | (_| |  __/
 *  |_|   \___/ \___|_|\_\___|\__|_| \_|\___/ \__,_|\___|
 *
 *  @author PocketNode Team
 *  @link https://pocketnode.me
*/

const ItemIds = require("./ItemIds");

const ItemFactory = require("../item/ItemFactory");

class Item extends ItemIds {
    static get TAG_ENCH() {
        return "ench"
    };

    static get TAG_DISPLAY() {
        return "display"
    };

    static get TAG_BLOCK_ENTITY_TAG() {
        return "BlockEntityTag"
    };

    static get TAG_DISPLAY_NAME() {
        return "Name"
    };

    static get TAG_DISPLAY_LORE() {
        return "Lore"
    };

    // static parseCompoundTag(tag) {
    //     if (tag === "") {
    //         console.log("No NBT data found in supplied string");
    //     }
    //
    //     if (self.cachedParser === null) {
    //         self.cachedParser = new LittleEndianNBTStream();
    //     }
    //
    //     let data = self.cachedParser.read(tag);
    //     if (!(data instanceof CompoundTag)) {
    //         console.log("Invalid item NBT string given, it could not be deserialized");
    //     }
    //
    //     return data;
    // }

    // static writeCompoundTag(tag) {
    //     CheckTypes([CompoundTag, tag]);
    //     if (self.cachedParser === null) {
    //         self.cachedParser = new LittleEndianNBTStream();
    //     }
    //
    //     return self.cachedParser.write(tag);
    // }

    /**
     *
     * @param id
     * @param meta
     * @param count
     * @param tags
     * @return {Item}
     */
    static get(id, meta = 0, count = 1, tags = "") {
        return ItemFactory.get(id, meta, count, tags);
    }

    initVars() {
        this.cachedParser = null;

        this._id = -1;
        this._meta = -1;
        this.tags = "";
        this.cachedNBT = null;
        this.count = 1;
        this._name = "";
    }

    /**
     *
     * @return {boolean}
     */
    isNull() {
        return this.count <= 0 || this._id === Item.AIR;
    }

}

module.exports = Item;