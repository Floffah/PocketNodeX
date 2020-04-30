function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const SkinImage = require('./SkinImage');

class SkinAnimation {
  /** @type {SkinImage} */

  /** @type {number} */

  /** @type {number} */
  constructor(image, type, frames) {
    _defineProperty(this, "_image", void 0);

    _defineProperty(this, "_type", void 0);

    _defineProperty(this, "_frames", void 0);

    this._image = image;
    this._type = type;
    this._frames = frames;
  }
  /**
   * Image of the animation.
   *
   * @return {SkinImage}
   */


  getImage() {
    return this._image;
  }
  /**
   * The type of animation you are applying.
   *
   * @return {number}
   */


  getType() {
    return this._type;
  }
  /**
   * The total amount of frames in an animation.
   *
   * @return {number}
   */


  getFrames() {
    return this._frames;
  }

}

_defineProperty(SkinAnimation, "TYPE_HEAD", 1);

_defineProperty(SkinAnimation, "TYPE_BODY_32", 2);

_defineProperty(SkinAnimation, "TYPE_BODY_64", 3);

module.exports = SkinAnimation;