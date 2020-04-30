const Isset = require("../utils/methods/Isset");

class AttributeMap extends Map {

    constructor() {
        super();
        this.initVars();
    }

    initVars() {
        this.attributes = [];
    }

    addAttribute(attribute) {
        this.attributes[attribute.getId()] = attribute;
    }

    getAttribute(id) {
        //return this.attributes[id] ?? null; token error because of ??
        if (this.attributes[id] !== null) {
            return this.attributes[id];
        } else {
            return null;
        }
    }

    getAll() {
        return this.attributes;
    }

    needSend() {
        this.attributes.filter(function (attribute) {
            return attribute.isSyncable() && attribute.isDesynchronized();
        });
    }

    offsetExists(offset) {
        return Isset(this.attributes[offset]);
    }

    offsetGet(offset) {
        return this.attributes[offset].getValue();
    }

    offsetSet(offset, value) {
        this.attributes[offset].setValue(value);
    }

    offsetUnset(offset) {
        console.log("Could not unset an attribute from an attribute map");
    }


}

module.exports = AttributeMap;