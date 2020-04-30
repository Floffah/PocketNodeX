function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const UUID = require('../../../../utils/UUID');

class PlayerListEntry {
  constructor() {
    _defineProperty(this, "uuid", void 0);

    _defineProperty(this, "entityUniqueId", void 0);

    _defineProperty(this, "username", void 0);

    _defineProperty(this, "skinData", void 0);

    _defineProperty(this, "xboxUserId", void 0);

    _defineProperty(this, "platformChatId", '');

    _defineProperty(this, "buildPlatform", -1);

    _defineProperty(this, "isTeacher", false);

    _defineProperty(this, "isHost", false);
  }

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