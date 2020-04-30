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

const BaseInventory = require("./BaseInventory");

const Living = require("../entity/Living");
const Item = require("../item/Item");

class ArmorInventory extends BaseInventory {
    /**
     * @param holder {Living}
     */
    constructor(holder) {
        super();
        this.initVars();

        this._holder = holder;
    }

    static get SLOT_HEAD() {
        return 0
    };

    static get SLOT_CHEST() {
        return 1
    };

    static get SLOT_LEGS() {
        return 2
    };

    static get SLOT_FEET() {
        return 3
    };

    initVars() {
        this._holder = null;
    }

    /**
     * @return {Living}
     */
    getHolder() {
        return this._holder;
    }

    /**
     * @return {string}
     */
    getName() {
        return "Armor";
    }

    /**
     *
     * @return {number}
     */
    getDefaultSize() {
        return 4;
    }

    /**
     * @return {Item}
     */
    getHelmet() {
        return this.getItem();
    }


}

module.exports = ArmorInventory;