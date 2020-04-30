class CommandOutputMessage {

    constructor() {
        /** @type {boolean} */
        this.isInternal = false;
        /** @type {string} */
        this.messageId = "";
        /** @type {string[]} */
        this.parameters = [];
    }
}

module.exports = CommandOutputMessage;