const Living = require("./Living");

class Creature extends Living {

    constructor(server, nbt) {
        super(server, nbt);
    }

}

module.exports = Creature;