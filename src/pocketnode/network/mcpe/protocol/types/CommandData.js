const CommandParameter = require("./CommandParameter");

class CommandData {

    constructor() {
        /** @type {string} */
        this.commandName = "";
        /** @type {string} */
        this.commandDescription = "";
        /** @type {number} */
        this.flags = -1;
        /** @type {number} */
        this.permission = -1;
        /** @type {CommandData|null} */
        this.aliases = null;
        /** @type {CommandParameter[][]} */
        this.overloads = [];
    }
}

module.exports = CommandData;