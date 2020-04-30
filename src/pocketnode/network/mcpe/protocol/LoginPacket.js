function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const DataPacket = require("./DataPacket");

const ProtocolInfo = require("../Info");

const BinaryStream = require("../NetworkBinaryStream");

const Utils = require("../../../utils/Utils");

class LoginPacket extends DataPacket {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "username", '');

    _defineProperty(this, "protocol", void 0);

    _defineProperty(this, "clientUUID", void 0);

    _defineProperty(this, "xuid", void 0);

    _defineProperty(this, "identityPublicKey", void 0);

    _defineProperty(this, "serverAddress", void 0);

    _defineProperty(this, "locale", void 0);

    _defineProperty(this, "chainData", void 0);

    _defineProperty(this, "clientDataJwt", void 0);

    _defineProperty(this, "clientData", void 0);
  }

  static getId() {
    return ProtocolInfo.LOGIN_PACKET;
  }

  canBeSentBeforeLogin() {
    return true;
  }

  mayHaveUnreadBytes() {
    return this.protocol !== null && this.protocol !== ProtocolInfo.PROTOCOL;
  }

  _decodePayload() {
    this.protocol = this.readInt();

    try {
      this.decodeConnectionRequest();
    } catch (e) {
      if (this.protocol === ProtocolInfo.PROTOCOL) {
        console.log("LoginPacket => same protocol: [CLIENT: => " + this.protocol + " / SERVER => " + ProtocolInfo.PROTOCOL + " ]");
        throw e;
      }

      console.log(this.constructor.name + " was thrown while decoding connection request in login (protocol version " + this.protocol);
    }
  }

  decodeConnectionRequest() {
    let buffer = new BinaryStream(this.read(this.readUnsignedVarInt()));
    this.chainData = JSON.parse(buffer.read(buffer.readLInt()).toString());
    let hasExtraData = false;
    this.chainData["chain"].forEach(chain => {
      let webtoken = Utils.decodeJWT(chain);

      if (typeof webtoken["extraData"] !== "undefined") {
        if (hasExtraData) {
          // error to handle
          console.log("Found 'extraData' multiple times in key chain");
        }

        hasExtraData = true;

        if (typeof webtoken["extraData"]["displayName"] !== "undefined") {
          this.username = webtoken["extraData"]["displayName"];
        }

        if (typeof webtoken["extraData"]["identity"] !== "undefined") {
          this.clientUUID = webtoken["extraData"]["identity"];
        }

        if (typeof webtoken["extraData"]["XUID"] !== "undefined") {
          this.xuid = webtoken["extraData"]["XUID"];
        }
      }

      if (typeof webtoken["identityPublicKey"] !== "undefined") {
        this.identityPublicKey = webtoken["identityPublicKey"];
      }
    });
    this.clientDataJwt = buffer.read(buffer.readLInt()).toString();
    this.clientData = Utils.decodeJWT(this.clientDataJwt);
    this.clientId = this.clientData["ClientRandomId"] || null;
    this.serverAddress = this.clientData["ServerAddress"] || null;
    this.locale = this.clientData["LanguageCode"] || null;
  }

  handle(session) {
    return session.handleLogin(this);
  }

}

module.exports = LoginPacket;