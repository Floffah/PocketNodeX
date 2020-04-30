const DataPacket = require("./DataPacket");

const ProtocolInfo = require("../Info");

class AutomationClientConnectPacket extends DataPacket {
  constructor() {
    super();
    this.initVars();
  }

  static getId() {
    return ProtocolInfo.AUTOMATION_CLIENT_CONNECT_PACKET;
  }

  initVars() {
    /** @type {string} */
    this.serverUri = "";
  }

  _decodePayload() {
    this.serverUri = this.readString();
  }

  _encodePayload() {
    this.writeString(this.serverUri);
  }

  handle(session) {
    return session.handleAutomationClientConnect(this);
  }

}

module.exports = AutomationClientConnectPacket;