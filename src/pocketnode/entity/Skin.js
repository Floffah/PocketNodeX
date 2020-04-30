function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Skin {
  /* Accepted skin sizes */

  /** @type {string} */

  /** @type {string} */

  /** @type {string} */

  /** @type {string} */

  /** @type {string} */

  /**
   * @param skinId {string}
   * @param skinData {string}
   * @param capeData {string}
   * @param geometryName {string}
   * @param geometryData {string}
   */
  constructor(skinId, skinData, capeData = "", geometryName = "", geometryData = "") {
    _defineProperty(this, "_skinId", void 0);

    _defineProperty(this, "_skinData", void 0);

    _defineProperty(this, "_capeData", void 0);

    _defineProperty(this, "_geometryName", void 0);

    _defineProperty(this, "_geometryData", void 0);

    this._skinId = skinId;
    this._skinData = skinData;
    this._capeData = capeData;
    this._geometryName = geometryName;
    this._geometryData = geometryData;
  }
  /**
   * @deprecated
   * @return {boolean}
   */


  isValid() {
    try {
      this.validate();
      return true;
    } catch (e) {
      return false;
    }
  }
  /**
   * @throws Error
   */


  validate() {
    if (this._skinId === "") {
      throw new Error('Skin ID must not be empty');
    }

    let len = this._skinData.length;

    if (!Skin.ACCEPTED_SKIN_SIZES.includes(len)) {
      throw new Error(`Invalid skin data size ${len} bytes (allowed sizes: ${Skin.ACCEPTED_SKIN_SIZES.join(', ')})`);
    }

    if (this._capeData !== "" && this._capeData.length !== 8192) {
      throw new Error(`Invalid cape data size ${this._capeData.length} bytes (must be exactly 8192 bytes)`);
    } //TODO: validate geometry

  }
  /** @return {string} */


  getSkinId() {
    return this._skinId;
  }
  /** @return {string} */


  getSkinData() {
    return this._skinData;
  }
  /** @return {string} */


  getCapeData() {
    return this._capeData;
  }
  /** @return {string} */


  getGeometryName() {
    return this._geometryName;
  }
  /** @return {string} */


  getGeometryData() {
    return this._geometryData;
  }

  debloatGeometryData() {
    if (this._geometryData !== "") {
      this._geometryData = JSON.stringify(JSON.parse(this._geometryData));
    }
  }

}

_defineProperty(Skin, "ACCEPTED_SKIN_SIZES", [64 * 32 * 4, 64 * 64 * 4, 128 * 128 * 4, 64 * 32 + 6]);

module.exports = Skin;