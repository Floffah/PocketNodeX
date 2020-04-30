const BinaryStream = require("../../binarystream/BinaryStream");

class UUID {

    constructor(part1 = 0, part2 = 0, part3 = 0, part4 = 0, version = null) {
        this.initVars();
        this._parts = [part1, part2, part3, part4];

        this._version = version || (this._parts[1] & 0xf000) >> 12;
    }

    static fromString(uuid, version = null) {
        return UUID.fromBinary(Buffer.from(uuid.trim().replace(/-/g, ""), "hex"), version);
    }

    // toString() {
    //     let hex = hex2bin(this.toBinary());
    //     return hex.substr(0, 8) + '-' + hex.substr(8, 4) + '-' + hex.substr(12, 4) + '-' + hex.substr(16, 4) + '-' + hex.substr(20, 12);
    // }

    // static fromData(...data) {
    //     let hash = String.raw(MD5(data.join()).words);
        // console.log(this.create_UUID())
        // return UUID.fromBinary(fixedHash[0], 3);
    // }

    // return randoms string uuid 16 bytes
    static stringFromRandom(){
        let dt = new Date().getTime();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    static fromRandom() {
        let strUUID = this.stringFromRandom();
        return UUID.fromString(strUUID, 3);

        // let stream = new BinaryStream();
        // return UUID.fromData(
        //     stream.writeInt(mt_rand(-0x7fffffff, 0x7fffffff)),
        //     stream.writeInt(mt_rand(-0x7fffffff, 0x7fffffff)),
        //     stream.writeInt(mt_rand(-0x7fffffff, 0x7fffffff)),
        //     stream.writeInt(mt_rand(-0x7fffffff, 0x7fffffff))
        // );
    }

    static fromBinary(uuid, version) {
        if (uuid.length !== 16) {
            console.log(uuid);
            throw new TypeError("UUID buffer must be exactly 16 bytes");
        }
        let stream = new BinaryStream(Buffer.from(uuid));
        return new UUID(stream.readInt(), stream.readInt(), stream.readInt(), stream.readInt(), version);
    }

    static hex2bin(hex) {
        let bytes = [], str;

        for (let i = 0; i < hex.length - 1; i += 2)
            bytes.push(parseInt(hex.substr(i, 2), 16));

        return String.fromCharCode.apply(String, bytes);
    }

    initVars() {
        this._parts = [0, 0, 0, 0];
        this._version = null;
    }

    getVersion() {
        return this._version;
    }

    equals(uuid) {
        if (uuid instanceof UUID) {
            //best way to do that
            return JSON.stringify(uuid._parts) === JSON.stringify(this._parts);
        }
        return false;
    }

    toBinary() {
        let stream = new BinaryStream();
        return stream.writeInt(this._parts[0] + this._parts[1] + this._parts[2] + this._parts[3]);
    }

    getPart(i) {
        return this._parts[i] ? this._parts[i] : null;
    }
}

module.exports = UUID;