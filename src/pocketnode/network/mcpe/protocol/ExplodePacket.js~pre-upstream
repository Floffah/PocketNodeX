const DataPacket = require("./DataPacket");

const ProtocolInfo = require("../Info");

const Vector3 = require("../../../math/Vector3");

class ExplodePacket extends DataPacket {
  constructor() {
    super();
    this.initVars();
  }

  static getId() {
    return ProtocolInfo.EXPLODE_PACKET;
  }

  initVars() {
    /** @type {Vector3} */
    this.position = null;
    /** @type {number} */

    this.radius = 0.00;
    /** @type {Vector3[]} */

    this.records = [];
  }

  clean() {
    this.records = [];
    return super.reset();
  }

  _decodePayload() {
    this.position = this.readVector3();
    this.radius = this.readVarInt() / 32;
    let count = this.readUnsignedVarInt();

    for (let i = 0; i < count; ++i) {
      let x, y, z;
      x = y = z = null;
      this.readSignedBlockPosition(x, y, z);
      this.records[i] = new Vector3(x, y, z);
    }
  }

  _encodePayload() {
    this.readVector3(this.position);
    this.writeVarInt(this.radius * 32);
    this.writeUnsignedVarInt(this.records.length);

    if (this.records.length > 0) {
      this.records.forEach(record => {
        this.readSignedBlockPosition(record.x, record.y, record.z);
      });
    }
  }

  handle(session) {
    return session.handleExplode(this);
  }

}

module.exports = ExplodePacket;