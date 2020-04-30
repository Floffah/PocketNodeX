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

class ScorePacketEntry {

    constructor() {
        this.initVars();
    }

    static TYPE_PLAYER() {
        return 1;
    }

    static TYPE_ENTITY() {
        return 2;
    }

    static TYPE_FAKE_PLAYER() {
        return 3;
    }

    initVars() {
        this.scoreboardId = 0;
        this.objectiveName = "";
        this.score = 0;

        this.type = 0;

        this.entityUniqueId = null;
        this.customName = null;
    }
}

module.exports = ScorePacketEntry;