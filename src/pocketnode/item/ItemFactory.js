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

const Item = require("./Item");

class ItemFactory {

    constructor() {
        this.initVars();
    }

    static init() {
        self.list = new Array(65536);

        //self.registerItem(new Showel())
    }

    static registerItem(item, override = false) {
        CheckTypes([Item, item]);
        let id = item.getId();
        if (!override && ItemFactory.isRegistered(id)) {
            console.log("Trying to overwrite an already registered item");
        }

        self.list[self.getListOffset(id)] = Object.assign(Object.create(Object.getPrototypeOf(item)), item);
    }

    static isRegistered(id) {
        if (id < 256) {
            //return BlockFactory.isRegistered(id); TODO
        }
        return self.list[self.getListOffset(id)] !== null;
    }

    static getListOffset(id) {
        if (id < -0x8000 || id > 0x7fff) {
            console.log("ID must be in range " + -0x8000 + " - " + 0x7fff);
        }
        return id & 0xffff;
    }

    initVars() {
        this.list = null;
    }

    // get(id, meta = 0, count = 1, tags = null) {
    //     if (!typeof tags === 'string' && !(tags instanceof CompoundTag) && tags !== null) {
    //         //TODO: better debug :)
    //         console.log("`tags` argument must be a string or CompoundTag instance, . (is_object($tags) ? instance of  get_class($tags) : gettype($tags)) . given DEBUG NOT COMPLETE... TEST PURPOSE");
    //     }
    //
    //     let item = null;
    //     try {
    //         let listed = self.list[self.getListOffset(id)];
    //         if (listed !== null) {
    //             item = Object.assign(Object.create(Object.getPrototypeOf(listed)), listed); //might not work
    //         } else if (id >= 0 && id < 256) {
    //             //TODO: let item = new ItemBlock(id, meta);
    //         } else {
    //             item = new Item(id, meta);
    //         }
    //     } catch (e) {
    //         console.log(`Item ID ${id} is invalid or out of bounds`);
    //     }
    //
    //     if (item instanceof Item) {
    //         item.setDamage();
    //         item.setCount();
    //         item.setCompoundTag(tags);
    //         return item;
    //     }
    // }
}

module.exports = ItemFactory;