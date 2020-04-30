const CommandEnum = require("./CommandEnum");

class CommandParameter {
    constructor() {
        /** @type {string} */
        this.paramName = "";
        /** @type {number} */
        this.paramType = -1;
        /** @type {boolean} */
        this.isOptional = false;
        /** @type {number} */
        this.byte1 = 0; //unknown, always zero except for in /gamerule command
        /** @type {CommandEnum|null} */
        this.enum = null;
        /** @type {string|null} */
        this.postfix = null;
    }
}

module.exports = CommandParameter;