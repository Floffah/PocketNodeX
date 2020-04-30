const SlotChangeAction = require("../../../../inventory/transaction/action/SlotChangeAction");

class NetworkInventoryAction {

    constructor() {
        this.initVars();
    }

    static get SOURCE_CONTAINER() {
        return 0
    };

    static get SOURCE_WORLD() {
        return 2
    }; //drop/pickup item entity

    static get SOURCE_CREATIVE() {
        return 3
    };

    static get SOURCE_CRAFTING_GRID() {
        return 100
    };

    static get SOURCE_TODO() {
        return 99999
    };

    /**
     * Fake window IDs for the SOURCE_TODO type (99999)
     *
     * These identifiers are used for inventory source types which are not currently implemented server-side in MCPE.
     * As a general rule of thumb, anything that doesn't have a permanent inventory is client-side. These types are
     * to allow servers to track what is going on in client-side windows.
     *
     * Expect these to change in the future.
     */
    static get SOURCE_TYPE_CRAFTING_ADD_INGREDIENT() {
        return -2
    };

    static get SOURCE_TYPE_CRAFTING_REMOVE_INGREDIENT() {
        return -3
    };

    static get SOURCE_TYPE_CRAFTING_RESULT() {
        return -4
    };

    static get SOURCE_TYPE_CRAFTING_USE_INGREDIENT() {
        return -5
    };

    static get SOURCE_TYPE_ANVIL_INPUT() {
        return -10
    };

    static get SOURCE_TYPE_ANVIL_MATERIAL() {
        return -11
    };

    static get SOURCE_TYPE_ANVIL_RESULT() {
        return -12
    };

    static get SOURCE_TYPE_ANVIL_OUTPUT() {
        return -13
    };

    static get SOURCE_TYPE_ENCHANT_INPUT() {
        return -15
    };

    static get SOURCE_TYPE_ENCHANT_MATERIAL() {
        return -16
    };

    static get SOURCE_TYPE_ENCHANT_OUTPUT() {
        return -17
    };

    static get SOURCE_TYPE_TRADING_INPUT_1() {
        return -20
    };

    static get SOURCE_TYPE_TRADING_INPUT_2() {
        return -21
    };

    static get SOURCE_TYPE_TRADING_USE_INPUTS() {
        return -22
    };

    static get SOURCE_TYPE_TRADING_OUTPUT() {
        return -23
    };

    static get SOURCE_TYPE_BEACON() {
        return -24
    };

    /** Any client-side window dropping its contents when the player closes it */
    static get SOURCE_TYPE_CONTAINER_DROP_CONTENTS() {
        return -100
    };

    static get ACTION_MAGIC_SLOT_CREATIVE_DELETE_ITEM() {
        return 0
    };

    static get ACTION_MAGIC_SLOT_CREATIVE_CREATE_ITEM() {
        return 1
    };

    static get ACTION_MAGIC_SLOT_DROP_ITEM() {
        return 0
    };

    static get ACTION_MAGIC_SLOT_PICKUP_ITEM() {
        return 1
    };

    initVars() {
        this.sourceType = -1;
        this.windowId = -1;
        this.sourceFlags = 0;
        this.inventorySlot = -1;
        this.oldItem = null;
        this.newItem = null;
    }

    read(packet) {
        this.sourceType = packet.readUnsignedVarInt();

        switch (this.sourceType) {
            case NetworkInventoryAction.SOURCE_CONTAINER:
                this.windowId = packet.readVarInt();
                break;
            case NetworkInventoryAction.SOURCE_WORLD:
                this.sourceFlags = packet.readUnsignedVarInt();
                break;
            case NetworkInventoryAction.SOURCE_CREATIVE:
                break;
            case NetworkInventoryAction.SOURCE_CRAFTING_GRID:
            case NetworkInventoryAction.SOURCE_TODO:
                this.windowId = packet.readVarInt();
                switch (this.windowId) {
                    case NetworkInventoryAction.SOURCE_TYPE_CRAFTING_RESULT:
                        packet.isFinalCraftingPart = true;
                    case NetworkInventoryAction.SOURCE_TYPE_CRAFTING_USE_INGREDIENT:
                        packet.isCraftingPart = true;
                        break;
                }
                break;
            default:
                console.log(`Unknown inventory action source type ${this.sourceType}`);
        }

        this.inventorySlot = packet.readUnsignedVarInt();
        this.oldItem = packet.readSlot(); //TODO
        this.newItem = packet.readSlot(); //TODO

        return this;
    }

    write(packet) {
        packet.writeUnsignedVarInt(this.sourceType);

        switch (this.sourceType) {
            case NetworkInventoryAction.SOURCE_CONTAINER:
                packet.writeVarInt(this.windowId);
                break;
            case NetworkInventoryAction.SOURCE_WORLD:
                packet.writeUnsignedVarInt(this.sourceFlags);
                break;
            case NetworkInventoryAction.SOURCE_CREATIVE:
                break;
            case NetworkInventoryAction.SOURCE_CRAFTING_GRID:
            case NetworkInventoryAction.SOURCE_TODO:
                packet.writeVarInt(this.windowId);
                break;
            default:
                console.log(`Unknown inventory action source type ${this.sourceType}`);
        }

        packet.writeUnsignedVarInt(this.inventorySlot);
        packet.writeSlot(this.oldItem);
        packet.writeSlot(this.newItem);
    }

    createInventoryAction(player) {
        switch (this.sourceType) {
            case NetworkInventoryAction.SOURCE_CONTAINER:
                let window = player.getWindow(this.windowId);
                if (window !== null) {
                    return new SlotChangeAction(window, this.inventorySlot, this.oldItem, this.newItem);
                }

                console.log(`Player " . ${player.getName()} . " has no open container with window ID ${this.windowId}`);
            case NetworkInventoryAction.SOURCE_WORLD:
                if (this.inventorySlot !== NetworkInventoryAction.ACTION_MAGIC_SLOT_DROP_ITEM) {
                    console.log(`Only expecting drop-item world actions from the client!`);
                }

            //TODO
        }
    }
}

module.exports = NetworkInventoryAction;