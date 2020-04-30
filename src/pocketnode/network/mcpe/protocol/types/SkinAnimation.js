const SkinImage = require('./SkinImage');

class SkinAnimation {

    static TYPE_HEAD = 1;
    static TYPE_BODY_32 = 2;
    static TYPE_BODY_64 = 3;

    /** @type {SkinImage} */
    _image;
    /** @type {number} */
    _type;
    /** @type {number} */
    _frames;

    constructor(image, type, frames) {
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
module.exports = SkinAnimation;