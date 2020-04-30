function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const SkinImage = require('./SkinImage');

const SkinAnimation = require('./SkinAnimation');

class SkinData {
  /** @type {string} */

  /** @type {string} */

  /** @type {SkinImage} */

  /** @type {SkinAnimation[]} */

  /** @type {SkinImage} */

  /** @type {string} */

  /** @type {string} */

  /** @type {boolean} */

  /** @type {boolean} */

  /** @type {boolean} */

  /** @type {string} */

  /**
   * @param skinId {string}
   * @param resourcePatch {string}
   * @param skinImage {SkinImage}
   * @param animations {SkinAnimation[]}
   * @param capeImage {SkinImage}
   * @param geometryData {string}
   * @param animationData {string}
   * @param premium {boolean}
   * @param persona {boolean}
   * @param personaCapeOnClassic {boolean}
   * @param capeId {string}
   */
  constructor(skinId, resourcePatch, skinImage, animations = [], capeImage = null, geometryData = '', animationData = '', premium = false, persona = false, personaCapeOnClassic = false, capeId = '') {
    _defineProperty(this, "_skinId", void 0);

    _defineProperty(this, "_resourcePatch", void 0);

    _defineProperty(this, "_skinImage", void 0);

    _defineProperty(this, "_animations", void 0);

    _defineProperty(this, "_capeImage", void 0);

    _defineProperty(this, "_geometryData", void 0);

    _defineProperty(this, "_animationData", void 0);

    _defineProperty(this, "_persona", void 0);

    _defineProperty(this, "_premium", void 0);

    _defineProperty(this, "_personaCapeOnClassic", void 0);

    _defineProperty(this, "_capeId", void 0);

    this._skinId = skinId;
    this._resourcePatch = resourcePatch;
    this._skinImage = skinImage;
    this._animations = animations;
    this._capeImage = capeImage;
    this._geometryData = geometryData;
    this._animationData = animationData;
    this._premium = premium;
    this._persona = persona;
    this._personaCapeOnClassic = personaCapeOnClassic;
    this._capeId = capeId;
  }
  /** @type {string} */


  getSkinId() {
    return this._skinId;
  }
  /** @type {string} */


  getResourcePatch() {
    return this._resourcePatch;
  }
  /** @type {SkinImage} */


  getSkinImage() {
    return this._skinImage;
  }
  /** @type {SkinAnimation[]} */


  getAnimations() {
    return this._animations;
  }
  /** @type {SkinImage} */


  getCapeImage() {
    return this._capeImage;
  }
  /** @type {string} */


  getGeometryData() {
    return this._geometryData;
  }
  /** @type {string} */


  getAnimationData() {
    return this._animationData;
  }
  /** @type {boolean} */


  isPersona() {
    return this._persona;
  }
  /** @type {boolean} */


  isPremium() {
    return this._premium;
  }
  /** @type {boolean} */


  isPersonaCapeOnClassic() {
    return this._personaCapeOnClassic;
  }
  /** @type {string} */


  getCapeId() {
    return this._capeId;
  }

}

module.exports = SkinData;