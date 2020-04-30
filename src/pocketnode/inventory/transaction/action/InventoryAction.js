const Item = require("../../../item/Item");

/**
 * Represents an action involving a change that applies in some way to an inventory or other item-source.
 */
class InventoryAction {

    constructor(sourceItem, targetItem) {
        this.initVars();
        this._sourceItem = sourceItem;
        this._targetItem = targetItem;
    }

    initVars() {
        this._sourceItem = null;
        this._targetItem = null;
    }

    /**
     * Returns the item that was present before the action took place.
     * @return {Item}
     */
    getSourceItem() {
        return clone(this._sourceItem);
    }


    /**
     * Returns the item that the action attempted to replace the source item with.
     * @return {Item}
     */
    getTargetItem() {
        return clone(this._targetItem);
    }

    isValid(source) {
    }

    onAddToTransaction(transaction) {
    }

    onPreExecute(source) {
    }

    execute(source) {
    }

    onExecuteSuccess(source) {
    }

    onExecuteFail(source) {
    }
}

module.exports = InventoryAction;
