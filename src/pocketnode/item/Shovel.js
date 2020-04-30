const TieredTool = require("./Tool");
const BlockToolType = require("../block/BlockToolType");

class Shovel extends TieredTool {

    getBlockToolType() {
        return BlockToolType.TYPE_SHOVEL;
    }
}

module.exports = Shovel;