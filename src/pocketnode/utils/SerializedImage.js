class SerializedImage {

    constructor(height, width, data) {
        this._height = height;
        this._width = width;
        this._data = data;
    }

    static fromLegacy(data) {
        switch (data.length) {
            case 64 * 32 * 4:
                return new SerializedImage(64, 32, data);
            case  64 * 64 * 4:
                return new SerializedImage(64, 64, data);
            case 128 * 64 * 4:
                return new SerializedImage(128, 64, data);
            case 128 * 128 * 4:
                return new SerializedImage(128, 128, data);
            default:
                console.log("Unknown SerializedImage size");
        }
    }

    initVars() {
        this._height = -1;
        this._width = -1;
        this._data = "";
    }

    getHeight() {
        return this._height;
    }

    getWidth() {
        return this._width;
    }

    getData() {
        return this._data;
    }
}

module.exports = SerializedImage;