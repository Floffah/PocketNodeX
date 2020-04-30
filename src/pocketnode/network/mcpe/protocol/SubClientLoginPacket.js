const DataPacket = require("./DataPacket");

const ProtocolInfo = require("../Info");

class SubClientLoginPacket extends DataPacket {
  constructor() {
    super();
    this.initVars();
  }

  static getId() {
    return ProtocolInfo.SUB_CLIENT_LOGIN_PACKET;
  }

  initVars() {
    this.connectionRequestData = "";
  }

  _decodePayload() {
    this.connectionRequestData = this.readString();
  }

  _encodePayload() {
    this.writeString(this.connectionRequestData);
  }

  handle(session) {
    return session.handleSubClientLogin(this);
  }

}

module.exports = SubClientLoginPacket;