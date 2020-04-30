const DataPacket = require("./DataPacket");

const ProtocolInfo = require("../Info");

const Item = require("../../../item/Item");

const Vector3 = require("../../../math/Vector3");

class AddItemActorPacket extends DataPacket {
  //TODO
  constructor() {
    super();
    this.initVars();
  }

  static getId() {
    return ProtocolInfo.ADD_ITEM_ACTOR_PACKET;
  }

  initVars() {
    /** @type {number|null} */
    this.entityUniqueId = null; //TODO

    /** @type {number} */

    this.entityRuntimeId = -1;
    /** @type {Item} */

    this.item = null;
    /** @type {Vector3} */

    this.position = null;
    /** @type {Vector3|null} */

    this.motion = null;
    /** @type {Array} */

    this.metadata = [];
    /** @type {boolean}*/

    this.isFromFishing = false;
  }

  _decodePayload() {
    this.entityUniqueId = this.readEntityUniqueId();
    this.entityRuntimeId = this.readEntityRuntimeId(); // todo: this.item = this.readSlot();
  }

}

module.exports = AddItemActorPacket;