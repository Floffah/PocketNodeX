function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class EntityLink {
  /** @const {number} */

  /** @const {number} */

  /** @const {number} */

  /** @type {number} */

  /** @type {number} */

  /** @type {number} */

  /** @type {boolean} */
  //for dismounting on mount death

  /**
   * @param fromEntityUniqueId {number}
   * @param toEntityUniqueId {number}
   * @param type {number}
   * @param immediate {boolean}
   */
  constructor(fromEntityUniqueId = null, toEntityUniqueId = null, type = null, immediate = false) {
    _defineProperty(this, "fromEntityUniqueId", void 0);

    _defineProperty(this, "toEntityUniqueId", void 0);

    _defineProperty(this, "type", void 0);

    _defineProperty(this, "immediate", void 0);

    this.fromEntityUniqueId = fromEntityUniqueId;
    this.toEntityUniqueId = toEntityUniqueId;
    this.type = type;
    this.immediate = immediate;
  }

}

_defineProperty(EntityLink, "TYPE_REMOVE", 0);

_defineProperty(EntityLink, "TYPE_RIDER", 1);

_defineProperty(EntityLink, "TYPE_PASSENGER", 2);

module.exports = EntityLink;