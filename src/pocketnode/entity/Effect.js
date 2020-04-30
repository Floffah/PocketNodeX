const EffectInstance = require("./EffectInstance");

class Effect {
    constructor(id, name, color, isBad = false, defaultDuration = 300 * 20, hasBubbles = true) {
        this._id = id;
        this._name = name;
        this._color = color;
        this._bad = isBad;
        this._defaultDuration = defaultDuration;
        this._hasBubbles = hasBubbles;
    }

    static get SPEED() {
        return 1
    };

    static get SLOWNESS() {
        return 2
    };

    static get HASTE() {
        return 3
    };

    static get FATIGUE() {
        return 4
    };

    static get MINING_FATIGUE() {
        return 4
    };

    static get STRENGTH() {
        return 5
    };

    static get INSTANT_HEALTH() {
        return 6
    }

    static get HEALING() {
        return 6
    };

    static get INSTANT_DAMAGE() {
        return 7
    }

    static get HARMING() {
        return 7
    };

    static get JUMP_BOOST() {
        return 8
    };

    static get JUMP() {
        return 8
    };

    static get NAUSEA() {
        return 9
    };

    static get CONFUSION() {
        return 9
    };

    static get REGENERATION() {
        return 10
    };

    static get RESISTANCE() {
        return 11
    };

    static get DAMAGE_RESISTANCE() {
        return 11
    };

    static get FIRE_RESISTANCE() {
        return 12
    };

    static get WATER_BREATHING() {
        return 13
    };

    static get INVISIBILITY() {
        return 14
    };

    static get BLINDNESS() {
        return 15
    };

    static get NIGHT_VISION() {
        return 16
    };

    static get HUNGER() {
        return 17
    };

    static get WEAKNESS() {
        return 18
    };

    static get POISON() {
        return 19
    };

    static get WITHER() {
        return 20
    };

    static get HEALTH_BOOST() {
        return 21
    };

    static get ABSORPTION() {
        return 22
    };

    static get SATURATION() {
        return 23
    };

    static get LEVITATION() {
        return 24
    }; //TODO

    static get FATAL_POISON() {
        return 25
    };

    static get CONDUIT_POWER() {
        return 26
    };

    static init() {

    }

    static registerEffect(effect) {
        self._effects[effect.getId()] = effect;
    }

    static getEffect(id) {
        if (self._effects[id] !== null) {
            return self._effects[id]
        } else {
            return null;
        }
    }

    static getEffectByName() {
        //TODO.
    }

    initVars() {
        this._effects = [];

        this._id = -1;
        this._name = "";
        this._color = null;
        this._bad = false;
        this._defaultDuration = 300 * 20;
        this._hasBubbles = true;
    }

    getId() {
        return this._id;
    }

    getName() {
        return this._name;
    }

    getColor() {
        return this._color;
    }

    isBad() {
        return this._bad;
    }

    isInstantEffect() {
        return this._defaultDuration <= 1;
    }

    getDefaultDuration() {
        return this._defaultDuration;
    }

    hasBubbles() {
        return this._hasBubbles;
    }

    canTick(instance) {
        switch (this._id) {
            case Effect.POISON:
            case Effect.FATAL_POISON:
                var interval; //TODO bruh.. no idea
                if ((interval = (25 >> instance.getAmplifier())) > 0) {
                    return (instance.getDuration() % interval) === 0;
                }
                return true;
            case Effect.WITHER:
                if ((interval = (50 >> instance.getAmplifier())) > 0) {
                    return (instance.getDuration() % interval) === 0;
                }
                return true;
            case Effect.REGENERATION:
                if ((interval = (40 >> instance.getAmplifier())) > 0) {
                    return (instance.getDuration() % interval) === 0;
                }
                return true;
            case Effect.HUNGER:
                return true;
            case Effect.INSTANT_DAMAGE:
            case Effect.INSTANT_HEALTH:
            case Effect.SATURATION:
                //If forced to last longer than 1 tick, these apply every tick.
                return true;
        }
        return false;
    }

    applyEffect(entity, instance, potency = 1.0, source) {
        CheckTypes([Living, entity], [EffectInstance, instance], [Entity, source])
    }
}

module.exports = Effect;