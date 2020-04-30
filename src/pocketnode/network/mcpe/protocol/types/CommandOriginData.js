const UUID = require("../../../../utils/UUID");

class CommandOriginData {

    constructor() {
        /** @type {number} */
        this.type = -1;
        /** @type {UUID} */
        this.uuid = null;

        /** @type {string} */
        this.requestId = "";

        /** @type {number} */
        this.varlong1 = -1;
    }

    static get ORIGIN_PLAYER() {
        return 0
    };

    static get ORIGIN_BLOCK() {
        return 1
    };

    static get ORIGIN_MINECART_BLOCK() {
        return 2
    };

    static get ORIGIN_DEV_CONSOLE() {
        return 3
    };

    static get ORIGIN_TEST() {
        return 4
    };

    static get ORIGIN_AUTOMATION_PLAYER() {
        return 5
    };

    static get ORIGIN_CLIENT_AUTOMATION() {
        return 6
    };

    static get ORIGIN_DEDICATED_SERVER() {
        return 7
    };

    static get ORIGIN_ENTITY() {
        return 8
    };

    static get ORIGIN_VIRTUAL() {
        return 9
    };

    static get ORIGIN_GAME_ARGUMENT() {
        return 10
    };

    static get ORIGIN_ENTITY_SERVER() {
        return 11
    };
}

module.exports = CommandOriginData;