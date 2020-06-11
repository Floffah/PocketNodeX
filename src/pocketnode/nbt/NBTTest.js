class NBTTest {
    constructor() {
        var fs = require('fs');
        var nbt = require('./nbt');
        var data = fs.readFileSync(__dirname + '/big_test.nbt');
        nbt.parse(data, function(error, data) {
            if (error) { throw error; }

            console.log(data.value);
            console.log(data.value['nested compound test'].value);
        });
    }
}

module.exports = NBTTest;
