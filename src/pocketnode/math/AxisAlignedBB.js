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

class AxisAlignedBB {

    constructor(minX, minY, minZ, maxX, maxY, maxZ) {
        this.initVars();
        this.setBounds(minX, minY, minZ, maxX, maxY, maxZ)
    }

    initVars() {
        this.minX = 0.0;
        this.minY = 0.0;
        this.minZ = 0.0;
        this.maxX = 0.0;
        this.maxY = 0.0;
        this.maxZ = 0.0;
    }

    setBounds(minX, minY, minZ, maxX, maxY, maxZ) {
        if (minX > maxX) {
            console.log("minX " + minX + " is larger than maxX " + maxX);
        }
        if (minY > maxY) {
            console.log("minY " + minY + " is larger than maxY " + maxY);
        }
        if (minZ > maxZ) {
            console.log("minZ " + minZ + " is larger than maxZ " + maxZ);
        }

        this.minX = minX;
        this.minY = minY;
        this.minZ = minZ;
        this.maxX = maxX;
        this.maxY = maxY;
        this.maxZ = maxZ;

        return this;
    }
}

module.exports = AxisAlignedBB;