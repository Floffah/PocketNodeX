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

const Chunk = require("../format/Chunk");

class Generator {

    /**
     * Generator Options
     * @constructor
     * @param options
     */
    constructor(options = {}) {
        this._options = options;
    }

    /**
     * Generator Name
     * @return {string}
     */
    getName() {
        return "unknown";
    }

    /**
     * Generate Chunk
     * @param chunkX {Number}
     * @param chunkZ {Number}
     * @param level {Level}
     *
     * @return {Boolean|Chunk}
     */
    generateChunk(chunkX, chunkZ, level = null) {
    }
}

module.exports = Generator;