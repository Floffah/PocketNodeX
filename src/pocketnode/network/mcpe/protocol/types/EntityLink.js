class EntityLink {

    /** @const {number} */
    static TYPE_REMOVE = 0;
    /** @const {number} */
    static TYPE_RIDER = 1;
    /** @const {number} */
    static TYPE_PASSENGER = 2;

    /** @type {number} */
    fromEntityUniqueId;
    /** @type {number} */
    toEntityUniqueId;
    /** @type {number} */
    type;
    /** @type {boolean} */
    immediate; //for dismounting on mount death

    /**
     * @param fromEntityUniqueId {number}
     * @param toEntityUniqueId {number}
     * @param type {number}
     * @param immediate {boolean}
     */
    constructor(fromEntityUniqueId = null, toEntityUniqueId = null, type = null, immediate = false) {
        this.fromEntityUniqueId = fromEntityUniqueId;
        this.toEntityUniqueId = toEntityUniqueId;
        this.type = type;
        this.immediate = immediate;
    }
}
module.exports = EntityLink;