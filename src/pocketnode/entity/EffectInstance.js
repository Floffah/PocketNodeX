import INT32_MAX from "../PocketNode";

class EffectInstance {

    constructor(effectType, duration = null, amplifier = 0, visible = true, ambient = false, overrideColor = null) {
        this.initVars();

        this._effectType = effectType;
        this._duration = duration;
        this._amplifier = amplifier;
        this._visible = visible;
        this._ambient = ambient;
        this._color = overrideColor; //todo finish here
    }

    initVars() {
        this._effectType = null;
        this._duration = -1;
        this._amplifier = -1;
        this._visible = true;
        this._ambient = false;
        this._color = null;
    }

    getId() {
        return this._effectType.getId();
    }

    getType() {
        return this._effectType;
    }

    getDuration() {
        return this._duration;
    }

    setDuration(duration) {
        if (duration < 0 || duration > INT32_MAX) {
            console.log(`Effect duration must be in range 0 - " . ${INT32_MAX} . ", got ${duration}`);
        }
        this._duration = duration;

        return this;
    }

    decreaseDuration(ticks) {
        this._duration = Math.max(0, this._duration - ticks);

        return this;
    }

    hasExpired() {
        return this._duration <= 0;
    }

    getAmplifier() {
        return this._amplifier;
    }

    getEffectLevel() {
        return this._amplifier + 1;
    }

    setAmplifier(amplifier) {
        this._amplifier = amplifier;

        return this;
    }

    isVisible() /*: Boolean*/ {
        return this._visible;
    }

    setVisible(visible) {
        this._visible = visible;

        return this;
    }

    isAmbient() {
        return this._ambient;
    }

    setAmbient(ambient) {
        this._ambient = ambient;

        return this;
    }

    getColor() {
        return this._color;
    }

    setColor(color) {
        this._color = color.clone();

        return this;
    }

    resetColor() {
        this._color = this._effectType.getColor();

        return this;
    }
}

module.exports = EffectInstance;