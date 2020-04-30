class ResourcePackType {

    constructor() {
        //NOOP
    }

    static get INVALID() {
        return 0
    };

    static get RESOURCES() {
        return 1
    };

    static get BEHAVIORS() {
        return 2
    };

    static get WORLD_TEMPLATE() {
        return 3
    };

    static get ADDON() {
        return 4
    };

    static get SKINS() {
        return 5
    };
}

module.exports = ResourcePackType;