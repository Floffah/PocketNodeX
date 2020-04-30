const DataPacket = require("./DataPacket");

const ProtocolInfo = require("../Info");

class MovePlayerPacket extends DataPacket {
  constructor() {
    super();
    this.initVars();
  }

  static get MODE_NORMAL() {
    return 0;
  }

  static get MODE_RESET() {
    return 1;
  }

  static get MODE_TELEPORT() {
    return 2;
  }

  static get MODE_ROTATION() {
    return 3;
  } //PITCH


  static get TELEPORTATION_CAUSE_UNKNOWN() {
    return 0;
  }

  static get TELEPORTATION_CAUSE_PROJECTILE() {
    return 1;
  }

  static get TELEPORTATION_CAUSE_CHORUS_FRUIT() {
    return 2;
  }

  static get TELEPORTATION_CAUSE_COMMAND() {
    return 3;
  }

  static get TELEPORTATION_CAUSE_BEHAVIOR() {
    return 4;
  }

  static get TELEPORTATION_CAUSE_COUNT() {
    return 5;
  }

  static getId() {
    return ProtocolInfo.MOVE_PLAYER_PACKET;
  }

  initVars() {
    this.entityRuntimeId = -1;
    this.position = [0, 0, 0];
    this.pitch = 0.0;
    this.yaw = 0.0;
    this.headYaw = 0.0;
    this.mode = MovePlayerPacket.MODE_NORMAL;
    this.onGround = false; //TODO

    this.ridingEid = 0;
    this.teleportCause = 0;
    this.teleportItem = 0;
  }

  _decodePayload() {
    //console.log("MovePlayerPacket got called!");
    this.entityRuntimeId = this.readEntityRuntimeId();
    this.position = this.readVector3();
    this.pitch = this.readLFloat();
    this.yaw = this.readLFloat();
    this.headYaw = this.readLFloat();
    this.mode = this.readByte();
    this.onGround = this.readBool();
    this.ridingEid = this.readEntityRuntimeId();

    if (this.mode === MovePlayerPacket.MODE_TELEPORT) {
      this.teleportCause = this.readLInt();
      this.teleportItem = this.readLInt();
    }
  }

  _encodePayload() {
    this.writeEntityRuntimeId(this.entityRuntimeId);
    this.writeVector3(this.position);
    this.writeLFloat(this.pitch);
    this.writeLFloat(this.yaw);
    this.writeLFloat(this.headYaw); //TODO

    this.writeByte(this.mode);
    this.writeBool(this.onGround);
    this.writeEntityRuntimeId(this.ridingEid);

    if (this.mode === MovePlayerPacket.MODE_TELEPORT) {
      this.writeLInt(this.teleportCause);
      this.writeLInt(this.teleportItem);
    }
  }

  handle(session) {
    return session.handleMovePlayer(this);
  }

}

module.exports = MovePlayerPacket;