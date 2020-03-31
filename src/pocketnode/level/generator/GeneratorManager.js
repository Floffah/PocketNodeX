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

const Generator = require("./Generator");

class GeneratorManager {
    constructor() {
        /**
         * @type {Map<String, Generator>} */
        this._generators = new Map();
    }

    /**
     * @param name {String}
     * @param generator {Generator}
     * @return {Boolean}
     */
    addGenerator(name, generator) {
        if (generator.prototype instanceof Generator && this._generators.has(name.toLowerCase())) {
            this._generators.set(name.toLowerCase(), generator);

            return true;
        }

        return false;
    }

    /**
     * @return {Array<String>}
     */
    getGeneratorList() {
        return Array.from(this._generators.keys());
    }

    /**
     * @param name {String}
     * @return {Generator|null}
     */
    getGenerator(name) {
        if (this._generators.has(name = name.toLowerCase())) {
            return this._generators.get(name);
        }

        return null; //normal
    }

    /**
     * @param generator {Generator}
     * @return {String}
     */
    getGeneratorName(generator) {
        for (let [name, gen] of this._generators) {
            if (gen === generator) {
                return name;
            }
        }

        return "unknown";
    }

    isGenerator(gen) {
        return gen.prototype instanceof Generator;
    }
}

module.exports = GeneratorManager;