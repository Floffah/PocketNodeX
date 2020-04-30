const LegacySkinAdapter = require('./LegacySkinAdapter');

/**
 * Accessor for SkinAdapter
 */
class SkinAdapterSingleton {

    /** @type {LegacySkinAdapter | null} */
    static _skinAdapter = null;

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
module.exports = SkinAdapterSingleton;