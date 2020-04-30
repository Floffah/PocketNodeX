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

const ClassHasMethod = require("../../utils/methods/ClassHasMethod");

class SubChunkInterface {
    constructor() {
        let methods = [
            "isEmpty",
            "getBlockId",
            "setBlock",
            "setBlockId",
            "getBlockData",
            "setBlockData",
            "getBlockLight",
            "setBlockLight",
            "getBlockSkyLight",
            "setBlockSkyLight",
            "getHighestBlockId",
            "getHighestBlockData",
            "getHighestBlock",
            "toBinary"
        ];

        let missingMethods;
        if ((missingMethods = ClassHasMethod(this.constructor, methods)) !== true) {
            throw new Error(this.constructor.name + " is missing the following method(s): " + missingMethods.join(", "));
        }
    }
}

module.exports = SubChunkInterface;