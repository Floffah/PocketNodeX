const Path = require("path");

/**
 * Require files from PocketNode
 * @param path {string}
 * @return {*}
 */
global.binarystream = function (path) {
    return require(Path.normalize(__dirname + "/../../../binarystream/" + path));
};
/**
 * @deprecated use them at your own risk... personally i prefer require()... it also give you hints.
 * @param path
 * @return {*}
 */
global.pocketnode = function (path) {
    return require(Path.normalize(__dirname + "/../../" + path));
};
global.raknet = function (path) {
    return require(Path.normalize(__dirname + "/../../../raknet/" + path));
};

global.hex2bin = function (s) {
    //  discuss at: https://locutus.io/php/hex2bin/
    // original by: Dumitru Uzun (https://duzun.me)
    //   example 1: hex2bin('44696d61')
    //   returns 1: 'Dima'
    //   example 2: hex2bin('00')
    //   returns 2: '\x00'
    //   example 3: hex2bin('2f1q')
    //   returns 3: false

    let ret = [];
    let i = 0;
    let l;

    s += '';

    for (l = s.length; i < l; i += 2) {
        let c = parseInt(s.substr(i, 1), 16);
        let k = parseInt(s.substr(i + 1, 1), 16);
        if (isNaN(c) || isNaN(k)) return false;
        ret.push((c << 4) | k)
    }

    return String.fromCharCode.apply(String, ret);
};

/*global.clone = function(src) {
    function mixin(dest, source, copyFunc) {
        let name, s, i, empty = {};
        for(name in source){
            // the (!(name in empty) || empty[name] !== s) condition avoids copying properties in "source"
            // inherited from Object.prototype.	 For example, if dest has a custom toString() method,
            // don't overwrite it with the toString() method that source inherited from Object.prototype
            s = source[name];
            if(!(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s))){
                dest[name] = copyFunc ? copyFunc(s) : s;
            }
        }
        return dest;
    }

    if(!src || typeof src != "object" || Object.prototype.toString.call(src) === "[object Function]"){
        // null, undefined, any non-object, or function
        return src;	// anything
    }
    if(src.nodeType && "cloneNode" in src){
        // DOM Node
        return src.cloneNode(true); // Node
    }
    if(src instanceof Date){
        // Date
        return new Date(src.getTime());	// Date
    }
    if(src instanceof RegExp){
        // RegExp
        return new RegExp(src);   // RegExp
    }
    let r, i, l;
    if(src instanceof Array){
        // array
        r = [];
        for(i = 0, l = src.length; i < l; ++i){
            if(i in src){
                r.push(clone(src[i]));
            }
        }
        // we don't clone functions for performance reasons
        //		}else if(d.isFunction(src)){
        //			// function
        //			r = function(){ return src.apply(this, arguments); };
    }else{
        // generic objects
        r = src.constructor ? new src.constructor() : {};
    }
    return mixin(r, src, clone);

};*/

global.clone = function (src) {
    return Object.assign({}, src);
};

// By Jackx
global.multiple = function (baseClass, ...mixins) {
    class base extends baseClass {
        constructor(...args) {
            super(...args);
            for (let y = 0; y < mixins.length; ++y) {
                let mixin = mixins[y];
                copyProps(this, (new mixin));
            }
        }
    }

    let copyProps = (target, source) => {
        let props = Object.getOwnPropertyNames(source).concat(Object.getOwnPropertySymbols(source));
        for (let z = 0; z < props.length; ++z) {
            let prop = props[z];
            if (!prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/))
                Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
        }
    };
    for (let x = 0; x < mixins.length; ++x) {
        let mixin = mixins[x];
        copyProps(base.prototype, mixin.prototype);
        copyProps(base, mixin);
    }
    return base;
};

// global.MD5 = function(d){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}

global.mt_rand = function mt_rand(min, max) {
    // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/mt_rand/
    // original by: Onno Marsman (https://twitter.com/onnomarsman)
    // improved by: Brett Zamir (http://brett-zamir.me)
    //    input by: Kongo
    //   example 1: mt_rand(1, 1)
    //   returns 1: 1

    var argc = arguments.length;
    if (argc === 0) {
        min = 0;
        max = 2147483647;
    } else if (argc === 1) {
        throw new Error('Warning: mt_rand() expects exactly 2 parameters, 1 given');
    } else {
        min = parseInt(min, 10);
        max = parseInt(max, 10);
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// global.atob = /* require("atob"); */ null;

// By Jackx
global.flipArray = function (array) {
    let newA = [];
    for (let prop in array) {
        if (array.hasOwnProperty(prop)) {
            newA[array[prop]] = prop;
        }
    }
    return newA;
};

global.str_pad = function (input, padLength, padString, padType) {

    let half = "";
    let padToGo;

    let _strPadRepeater = function (s, len) {
        let collect = "";

        while (collect.length < len) {
            collect += s;
        }
        collect = collect.substr(0, len);

        return collect;
    };

    input += "";
    padString = padString !== undefined ? padString : " ";

    if (padType !== "STR_PAD_LEFT" && padType !== "STR_PAD_RIGHT" && padType !== "STR_PAD_BOTH") {
        padType = "STR_PAD_RIGHT";
    }
    if ((padToGo = padLength - input.length) > 0) {
        if (padType === "STR_PAD_LEFT") {
            input = _strPadRepeater(padString, padToGo) + input;
        } else if (padType === "STR_PAD_RIGHT") {
            input = input + _strPadRepeater(padString, padToGo);
        } else if (padType === "STR_PAD_BOTH") {
            half = _strPadRepeater(padString, Math.ceil(padToGo / 2));
            input = half + input + half;
            input = input.substr(0, padLength);
        }
    }

    return input;
};

const SFS = pocketnode("utils/SimpleFileSystem");

void function () {
    function walk(dir) {
        SFS.walkDir(dir).forEach(path => {
            if (SFS.basename(SFS.dirname(path)) === "pocketnode" && SFS.isFile(path)) return; //omit Server, PocketNode

            let parent;
            if (SFS.isDir(path)) {
                parent = trace(path);
            } else if (SFS.isFile(path)) {
                parent = trace(SFS.dirname(path));
            }


            if (SFS.isDir(path)) {
                walk(path);
            } else if (SFS.isFile(path)) {
                parent.files[Path.basename(path, ".js")] = path;
            }
        });
    }

    function trace(path) {
        path = path.split(Path.sep);
        path = path.slice(path.lastIndexOf("pocketnode") + 1);

        let parent = global.pocketnode;

        path.forEach(part => {
            if (part === "") return;

            if (typeof parent[part] === "undefined") {
                parent[part] = {
                    files: {},
                    use: function (file) {
                        if (typeof file === "string") {
                            file = file.indexOf(".js") !== -1 ? file.slice(0, -3) : file;
                            if (Object.keys(this.files).indexOf(file) !== -1) {
                                return require(this.files[file]);
                            } else {
                                throw new Error(`The requested resource, ${file}, was not found!`);
                            }
                        } else if (file instanceof Array) {
                            let files = [];

                            file.forEach(f => {
                                if (Object.keys(this.files).indexOf(f) !== -1) {
                                    files.push(require(this.files[f]));
                                } else {
                                    files.push(undefined);
                                }
                            });

                            return files;
                        }
                    },
                    all() {
                        let all = {};
                        for (let name in this.files) {
                            all[name] = require(this.files[name]);
                        }
                        return all;
                    }
                };
            }

            parent = parent[part];
        });

        return parent;
    }

    walk(__dirname + "/../../");
}();


/**
 * PHP-like rounding added onto the Math object
 * @param value     {number}
 * @param precision {number}
 * @param mode      {string}
 * @return {Number}
 */
Math.round_php = function (value, precision = 0, mode = "ROUND_HALF_UP") {
    let m, f, isHalf, sgn;
    m = Math.pow(10, precision);
    value *= m;
    // sign of the number
    sgn = (value > 0) | -(value < 0);
    isHalf = value % 1 === 0.5 * sgn;
    f = Math.floor(value);
    if (isHalf) {
        switch (mode) {
            case "ROUND_HALF_DOWN":
                // rounds .5 toward zero
                value = f + (sgn < 0);
                break;
            case "ROUND_HALF_EVEN":
                // rounds .5 towards the next even integer
                value = f + (f % 2 * sgn);
                break;
            case "ROUND_HALF_ODD":
                // rounds .5 towards the next odd integer
                value = f + !(f % 2);
                break;
            default:
                // rounds .5 away from zero
                value = f + (sgn > 0);
        }
    }
    return ((isHalf ? value : Math.round(value)) / m);
};

/**
 * CheckTypes
 * Example: CheckTypes([String, "myString"]); // true
 *          CheckTypes([String, 12]); // throws TypeError
 *
 * @throws {TypeError}
 * @return {boolean}
 */
global.CheckTypes = function (...args) {
    if (args.length === 0) throw new TypeError("Expecting at least 1 Array. Example: [Object, myObjectVar]");

    args.forEach(arg => {
        if (!(arg instanceof Array)) {
            throw new TypeError("Expecting Array, got " + (arg.constructor.name ? arg.constructor.name : arg.name));
        }

        if (typeof arg[0] === "undefined" || typeof arg[1] === "undefined") {
            throw new TypeError("Expecting Array with two items. Example: [Object, myObjectVar]");
        }

        let type = arg[0];
        let item = arg[1];

        if (
            !(item instanceof type) &&
            (item.constructor.name !== type.name && item.constructor !== type)
        ) {
            throw new TypeError("Expecting " + type.name + ", got " + item.constructor.name);
        }
    });
    return true;
};

String.prototype.ltrim = function (char) {
    let str = this.valueOf();
    while (true) {
        if (str[0] === char) str = str.substr(1);
        else break;
    }
    return str;
};

String.prototype.rtrim = function (char) {
    let str = this.valueOf().split("").reverse().join("");
    while (true) {
        if (str[0] === char) str = str.substr(1);
        else break;
    }
    return str.split("").reverse().join("");
};

String.prototype.contains = function (str) {
    return this.indexOf(str) !== -1;
};

Math.fmod = function (a, b) {
    return Number((a - (Math.floor(a / b) * b)).toPrecision(8));
};

/**
 * @author Jonas Raoni Soares Silva
 * @link http://jsfromhell.com/string/wordwrap
 */
String.prototype.wordwrap = function (m, b, c) {
    let i, j, l, s, r;
    if (m < 1)
        return this;
    for (i = -1, l = (r = this.split("\n")).length; ++i < l; r[i] += s)
        for (s = r[i], r[i] = ""; s.length > m; r[i] += s.slice(0, j) + ((s = s.slice(j)).length ? b : ""))
            j = c == 2 || (j = s.slice(0, m + 1).match(/\S*(\s)?$/))[1] ? m : j.input.length - j[0].length
                || c == 1 && m || j.input.length + (j = s.slice(m).match(/^\S*/)).input.length;
    return r.join("\n");
};

global.assert = require("assert");

global.str_split = function (string, splitLength) {
    if (splitLength === null) {
        splitLength = 1
    }
    if (string === null || splitLength < 1) {
        return false
    }

    string += '';
    var chunks = [];
    var pos = 0;
    var len = string.length;

    while (pos < len) {
        chunks.push(string.slice(pos, pos += splitLength));
    }

    return chunks
};

global.sleep = function (ms) {
    return sleep_until(Date.now() + ms);
};

global.sleep_until = function (ms) {
    while (Date.now() < ms) {
    }
    return true;
};

/**
 * A more accurate interval
 * @param fn       {Function}
 * @param interval {Number}
 */
global.createInterval = function (fn, interval) {
    return new (function () {
        this.baseline = undefined;
        this.run = function () {
            if (this.baseline === undefined) {
                this.baseline = Date.now();
            }

            fn();

            let end = Date.now();
            this.baseline += interval;

            let nextTick = interval - (end - this.baseline);
            if (nextTick < 0) nextTick = 0;
            this.timer = setTimeout(() => this.run(end), nextTick);
        };

        this.stop = () => clearTimeout(this.timer);
    });
};

global.TRAVIS_BUILD = process.argv.indexOf("--travis-build") !== -1;
global.RUNNING_LOCALLY = (process.argv.indexOf("--local") !== -1 || process.argv.indexOf("-l") !== -1);