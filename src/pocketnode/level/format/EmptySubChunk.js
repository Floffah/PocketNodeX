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

const SubChunkInterface = require("./SubChunkInterface");

class EmptySubChunk extends SubChunkInterface {
    constructor() {
        super();
    }

    isEmpty() {
        return true;
    }

    getBlockId() {
        return 0;
    }

    setBlock() {
        return false;
    }

    setBlockId() {
        return false;
    }

    getBlockData() {
        return 0;
    }

    setBlockData() {
        return false;
    }

    getBlockLight() {
        return 0;
    }

    setBlockLight() {
        return false;
    }

    getBlockSkyLight() {
        return 0;
    }

    setBlockSkyLight() {
        return false;
    }

    getHighestBlockId() {
        return 0;
    }

    getHighestBlockData() {
        return 0;
    }

    getHighestBlock() {
        return 0;
    }

    toBinary() {
        return Buffer.alloc(6145).fill(0x00);
    }
}

module.exports = EmptySubChunk;