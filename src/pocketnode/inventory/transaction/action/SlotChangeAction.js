const InventoryTransaction = require("./InventoryAction");

class SlotChangeAction extends InventoryTransaction {

    constructor(inventory, inventorySlot) {
        super();
        this.initVars();
        this._inventory = inventory;
        this._inventorySlot = inventorySlot;
    }

    initVars() {
        this._inventory = null;
        this._inventorySlot = -1;
    }

    getInventory() {
        return this._inventory;
    }

    getSlot() {
        return this._inventorySlot;
    }

    //TODO
}

module.exports = SlotChangeAction;