/*
 *   _____           _        _   _   _           _
 *  |  __ \         | |      | | | \ | |         | |
 *  | |__) |__   ___| | _____| |_|  \| | ___   __| | ___
 *  |  ___/ _ \ / __| |/ / _ \ __| . ` |/ _ \ / _` |/ _ \
 *  | |  | (_) | (__|   <  __/ |_| |\  | (_) | (_| |  __/
 *  |_|   \___/ \___|_|\_\___|\__|_| \_|\___/ \__,_|\___|
 *
 *  @author PocketNode Team
 *  @link https://pocketnode.me
*/

const Position = require("./Position");

class Location extends Position {
    /**
     * Represents a Position with added Yaw and Pitch references
     * @constructor
     * @param {Number}   x
     * @param {Number}   y
     * @param {Number}   z
     * @param {Number}   yaw
     * @param {Number}   pitch
     * @param {Level}    level
     */

    /**
     * @param x     {Number}
     * @param y     {Number}
     * @param z     {Number}
     * @param yaw   {Number}
     * @param pitch {Number}
     * @param level {Level}
     */
    constructor(x = 0, y = 0, z = 0, yaw = 0.0, pitch = 0.0, level = null) {
        super(x, y, z, level);
        this._yaw = yaw;
        this._pitch = pitch;
    }

    /**
     * @param pos   {Vector3}
     * @param level {Level|null}
     * @param yaw   {Number}
     * @param pitch {Number}
     *
     * @return {Location}
     */
    static fromObject(pos, level = null, yaw = 0.0, pitch = 0.0) {
        return new Location(pos.x, pos.y, pos.z, yaw, pitch, (level === null ? (pos instanceof Position ? pos.level : null) : level));
    }

    /**
     * Return a Location instance
     *
     * @return {Location}
     */
    asLocation() {
        return new Location(this.x, this.y, this.z, this._yaw, this._pitch, this.level);
    }

    getYaw() {
        return this._yaw;
    }

    getPitch() {
        return this._pitch;
    }

    toString() {
        return "Location (level=" + (this.isValid() ? this.getLevel().getName() : "null") + ", x=" + this.x + ", y=" + this.y + ", z=" + this.z + ", yaw=" + this._yaw + ", pitch=" + this._pitch + ")";
    }

    equals(v) {
        if (v instanceof Location) {
            return super.equals(v) && v.yaw === this._yaw && v.pitch === this._pitch;
        }
        return super.equals(v);
    }

}

module.exports = Location;
