function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const OfflineMessage = require("./OfflineMessage");

const MessageIdentifiers = require("./MessageIdentifiers");

class UnconnectedPong extends OfflineMessage {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "sendPingTime", void 0);

    _defineProperty(this, "serverId", void 0);

    _defineProperty(this, "serverName", void 0);
  }

  static getId() {
    return MessageIdentifiers.ID_UNCONNECTED_PONG;
  }
  /** @type {number} */


  encodePayload() {
    this.getStream().writeLong(this.pingId);
    this.getStream().writeLong(this.serverId);
    this.writeMagic();
    this.writeString(this.serverName);
  }

}

module.exports = UnconnectedPong;