function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const LegacySkinAdapter = require('./LegacySkinAdapter');
/**
 * Accessor for SkinAdapter
 */


class SkinAdapterSingleton {
  /** @type {LegacySkinAdapter | null} */
  static get() {
    if (this._skinAdapter === null) {
      this._skinAdapter = new LegacySkinAdapter();
    }

    return this._skinAdapter;
  }

  static set(adapter) {
    this._skinAdapter = adapter;
  }

}

_defineProperty(SkinAdapterSingleton, "_skinAdapter", null);

module.exports = SkinAdapterSingleton;