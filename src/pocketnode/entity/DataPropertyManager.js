const Isset = require("../utils/methods/Isset");
const Entity = require("./Entity");

class DataPropertyManager {

    constructor() {
        this.initVars();
    }

    initVars() {
        this._properties = [];
        this._dirtyProperties = []
    }

    /**
     * @param key
     *
     * @return {boolean}
     */
    getByte(key) {
        let value = this.getPropertyValue(key, Entity.DATA_TYPE_BYTE);
        assert(typeof value === 'number' || value === null);
        return value;
    }

    /**
     * @param key
     * @param value
     * @param force
     */
    setByte(key, value, force = false) {
        this.setPropertyValue(key, Entity.DATA_TYPE_BYTE, value, force);
    }

    /**
     * @param key
     *
     * @return {boolean}
     */
    getShort(key) {
        let value = this.getPropertyValue(key, Entity.DATA_TYPE_SHORT);
        assert(typeof value === 'number' || value === null);
        return value;
    }

    /**
     * @param key
     * @param value
     * @param force
     */
    setShort(key, value, force = false) {
        this.setPropertyValue(key, Entity.DATA_TYPE_SHORT, value, force);
    }

    /**
     * @param key
     *
     * @return {boolean}
     */
    getInt(key) {
        let value = this.getPropertyValue(key, Entity.DATA_TYPE_INT);
        assert(typeof value === 'number' || value === null);
        return value;
    }

    /**
     * @param key
     * @param value
     * @param force
     */
    setInt(key, value, force = false) {
        this.setPropertyValue(key, Entity.DATA_TYPE_INT, value, force);
    }

    /**
     * @param key
     *
     * @return {boolean}
     */
    getFloat(key) {
        let value = this.getPropertyValue(key, Entity.DATA_TYPE_FLOAT);
        assert(typeof value === 'number' || value === null);
        return value;
    }

    /**
     * @param key {number}
     * @param value {number}
     * @param force {boolean}
     */
    setFloat(key, value, force = false) {
        this.setPropertyValue(key, Entity.DATA_TYPE_FLOAT, value, force);
    }

    /**
     * @param key {number}
     *
     * @return {boolean}
     */
    getString(key) {
        let value = this.getPropertyValue(key, Entity.DATA_TYPE_STRING);
        assert(typeof value === 'string' || value === null);
        return value;
    }

    /**
     * @param key {number}
     * @param value {number}
     * @param force {boolean}
     */
    setString(key, value, force = false) {
        this.setPropertyValue(key, Entity.DATA_TYPE_STRING, value, force);
    }

    //TODO: Item
    //TODO: Block
    //TODO: Long
    //TODO: Vector3

    /**
     * @param key {number}
     */
    removeProperty(key) {
        let index = this._properties.indexOf(key);
        this._properties.splice(index, 1);
        // delete this._properties[key];
    }

    /**
     * @param key {number}
     *
     * @return {boolean}
     */
    hasProperty(key) {
        return Isset(this._properties[key]);
    }

    /**
     * @param key {number}
     *
     * @return {number}
     */
    getPropertyType(key) {
        if (Isset(this._properties[key])) {
            return this._properties[key][0];
        }

        return -1;
    }

    _checkType(key, type) {
        if (Isset(this._properties[key]) && this._properties[key][0] !== type) {
            console.log(`Expected type ${type}, but have " . ${this._properties[key][0]}`)
        }
    }

    /**
     * @param key {number}
     * @param type {number}
     *
     * @return {*}
     */
    getPropertyValue(key, type) {
        if (type !== -1) {
            this._checkType(key, type);
        }
        return Isset(this._properties[key] ? this._properties[key][1] : null);
    }

    /**
     * @param key {number}
     * @param type {number}
     * @param value {*}
     * @param force {boolean}
     */
    setPropertyValue(key, type, value, force = false) {
        if (!force) {
            this._checkType(key, type);
        }

        this._properties[key] = this._dirtyProperties[key] = [type, value];
    }

    /**
     * Returns all properties.
     *
     * @return {Array}
     */
    getAll() {
        return this._properties;
    }

    /**
     * Returns properties that have changed and need to be broadcasted.
     *
     * @return {Array}
     */
    getDirty() {
        return this._dirtyProperties;
    }

    /**
     * Clears records of dirty properties.
     */
    cleanDirtyProperties() {
        this._dirtyProperties = [];
    }
}

module.exports = DataPropertyManager;