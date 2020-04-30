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

const Inventory = require("./Inventory");
const InventoryEventProcessor = require("./InventoryEventProcessor");
const Isset = require("../utils/methods/Isset");
const Item = require("../item/Item");


class BaseInventory extends Inventory {

    constructor(items = [], size = null, title = null) {
        super();
        this.initVars();
        this._slots = new Array(size || this.getDefaultSize());
        this._title = title || this.getName();

        this.setContents(items, false);
    }

    initVars() {
        this._maxStackSize = Inventory.MAX_STACK;
        this._name = "";
        this._title = "";
        this._slots = [];
        this._viewers = [];
        this._eventProcessor = new InventoryEventProcessor();
    }

    /**
     * @return {string}
     */
    getName() {
    };

    getTitle() {
        return this._title;
    }

    /**
     * Returns the size of the inventory.
     * @return {number}
     */
    getSize() {
        return this._slots.length;
    }

    /**
     * Sets the new size of the inventory.
     * WARNING: If the size is smaller, any items past the new size will be lost.
     *
     * @param size {number}
     */
    setSize(size) {
        this._slots.length = size;
    }

    getDefaultSize() {
    };

    getMaxStackSize() {
        return this._maxStackSize;
    }

    setContents(items, send = true) {
        if (items.length > this.getSize()) {
            let items = items.slice(0, this.getSize());
        }

        for (let i = 0, size = this.getSize(); i < size; ++i) {
            if (!Isset(items[i])) {
                if (this._slots[i] !== null) {
                    this.clear(i, false);
                }
            } else {
                if (!this.setItem(i, items[i], false)) {
                    this.clear(i, false);
                }
            }
        }

        if (send) {
            this.setContents(this.getViewers());
        }
    }

    getViewers() /*: Player[] mhh.. this might crash server xD*/ {
        return this._viewers;
    }

    setItem(index, item, send = true) {
        CheckTypes([Item, item]);
        if (item.isNull()) {

        }
    }

}

module.exports = BaseInventory;