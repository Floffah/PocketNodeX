function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class SkinImage {
  /** @type {number} */

  /** @type {number} */

  /** @type {string} */

  /**
   * @param height {number}
   * @param width {number}
   * @param data {string}
   */
  constructor(height, width, data) {
    _defineProperty(this, "_height", void 0);

    _defineProperty(this, "_width", void 0);

    _defineProperty(this, "_data", void 0);

    if (height < 0 || width < 0) {
      throw new Error('Height and width cannot be negative');
    }

    let expected, actual;

    if ((expected = height * width * 4) !== (actual = data.length)) {
      throw new Error(`Data should be exactly ${expected} bytes, got ${actual} bytes`);
    }

    this._height = height;
    this._width = width;
    this._data = data;
  }
  /**
   * @param data {string}
   *
   * @return {SkinImage}
   */


  static fromLegacy(data) {
    switch (data.length) {
      case 64 * 32 * 4:
        return new this(64, 32, data);

      case 64 * 64 * 4:
        return new this(64, 64, data);

      case 128 * 64 * 4:
        return new this(128, 64, data);

      case 128 * 128 * 4:
        return new this(128, 128, data);
    }

    throw new Error('Unknown size');
  }
  /** @return {number} */


  getHeight() {
    return this._height;
  }
  /** @return {number} */


  getWidth() {
    return this._width;
  }
  /** @return {string} */


  getData() {
    return this._data;
  }

}

module.exports = SkinImage;