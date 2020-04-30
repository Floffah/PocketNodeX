const UUID = require('../../../../utils/UUID');

class PlayerListEntry {
    /** @type {UUID} */
    uuid;
    /** @type {number} */
    entityUniqueId;
    /** @type {string} */
    username;
    skinData; // TODO
    /** @type {string} */
    xboxUserId;
    /** @type {string} */
    platformChatId = '';
    /** @type {number} */
    buildPlatform = -1;
    /** @type {boolean} */
    isTeacher = false;
    /** @type {boolean} */
    isHost = false;

    /**
     * @param uuid {UUID}
     * @return PlayerListEntry
     */
    static createRemovalEntry(uuid) {
        let entry = new PlayerListEntry();
        entry.uuid = uuid;

        return entry;
    }

    /**
     * @param uuid {UUID}
     * @param entityUniqueId {number}
     * @param username {string}
     * @param skinData
     * @param xboxUserId {string}
     * @param platformChatId {string}
     * @param buildPlatform {number}
     * @param isTeacher {boolean}
     * @param isHost {boolean}
     *
     * @return PlayerListEntry
     */
    static createAdditionEntry(uuid, entityUniqueId, username, skinData, xboxUserId = '', platformChatId = '', buildPlatform = -1, isTeacher = false, isHost = false) {
        let entry = new PlayerListEntry();
        entry.uuid = uuid;
        entry.entityUniqueId = entityUniqueId;
        entry.username = username;
        entry.skinData = skinData;
        entry.xboxUserId = xboxUserId;
        entry.platformChatId = platformChatId;
        entry.buildPlatform = buildPlatform;
        entry.isTeacher = isTeacher;
        entry.isHost = isHost;

        return entry;
    }
}
module.exports = PlayerListEntry;