const Tool = require("./Tool");

class TieredTool extends Tool {

    constructor(id, meta, name, tier) {
        super(id, meta, name, tier);
        this.initVars();
        this._tier = tier;
    }

    static get TIER_WOODEN() {
        return 1
    };

    static get TIER_GOLD() {
        return 2
    };

    static get TIER_STONE() {
        return 3
    };

    static get TIER_IRON() {
        return 4
    };

    static get TIER_DIAMOND() {
        return 5
    };

    initVars() {
        this._tier = -1;
    }

    getTier() {
        return this._tier
    }
}

module.exports = TieredTool;