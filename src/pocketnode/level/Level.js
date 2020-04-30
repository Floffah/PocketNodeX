const INT32_MIN = -0x80000000;
const INT32_MAX = 0x7fffffff;

const Isset = require("../utils/methods/Isset");
const Position = require("./Position");

class Level {

    constructor(server, name, provider) {
        this.initVars();

        //this._blockStates = BlockFactory; //TODO
        this._levelId = this._levelIdCounter++;
        //this._blockMetadata = new BlockMetadataStore(this);
        this._server = server;

    }

    static get Y_MAX() {
        return 0x100
    };

    static get Y_MASK() {
        return 0xFF
    };

    static get DIFFICULTY_PEACEFUL() {
        return 0
    };

    static get DIFFICULTY_EASY() {
        return 1
    };

    static get DIFFICULTY_NORMAL() {
        return 2
    };

    static get DIFFICULTY_HARD() {
        return 3
    };

    /**
     * @param x {Number}
     * @param z {Number}
     * @return {Number}
     */
    static chunkHash(x, z) {
        return ((x & 0xFFFFFFFF) << 32) | (z & 0xFFFFFFFF);
    }

    static blockHash(x, y, z) {
        if (y < 0 || y >= Level.Y_MAX) {
            console.log(`Y coordinate ${y} is out of range!`);
        }
        return ((x & 0xFFFFFFF) << 36) | ((y & Level.Y_MASK) << 28) | (z & 0xFFFFFFF);
    }

    /**
     *
     * @param x
     * @param y
     * @param z
     * @return {number}
     */
    static chunkBlockHash(x, y, z) {
        return (y << 8) | ((z & 0xf) << 4) | (x & 0xf);
    }

    initVars() {
        this._temporalPosition = new Position();
        this._levelIdCounter = 1;
        this._chunkLoaderCounter = 1;

        this.tickRateTime = 0;
        this._server = null;

        this._levelId = -1;

        this._name = "";
        this._id = -1;
        /** @type {Map<Number, Dimension>} */
        this._dimensions = new Map();
        this._defaultDimension = null;
        this._blockCache = [];

        /** @type {Map<String, GameRule>} */
        this._gameRules = new Map();

        /** @type {Map<Number, Chunk>} */
        this._chunks = new Map();
        this._worldHeight = 256;
        this._blockStates = [];

        this._blockMetadata = null;

        this.updateEntities = [];
    }

    getBlockXYZ(hash, x, y, z) {
        x = hash >> 36;
        y = (hash >> 28) & Level.Y_MASK;
        z = (hash & 0xFFFFFFF) << 36 >> 36;
    }

    getXZ(hash, x, z) {
        x = hash >> 32;
        z = (hash & 0xFFFFFFFF) << 32 >> 32;
    }

    generateChunkLoaderId(loader) {
        if (loader.getLoaderId() === 0) {
            return this._chunkLoaderCounter++;
        } else {
            console.log(`ChunkLoader has a loader id already assigned: " . ${loader.getLoaderId()}`)
        }
    }

    getDifficultyFromString(str) {
        switch (str.toLowerCase().trim()) {
            case "0":
            case "peaceful":
            case "p":
                return Level.DIFFICULTY_PEACEFUL;

            case "1":
            case "easy":
            case "e":
                return Level.DIFFICULTY_EASY;

            case "2":
            case "normal":
            case "n":
                return Level.DIFFICULTY_NORMAL;

            case "3":
            case "hard":
            case "h":
                return Level.DIFFICULTY_HARD;
        }

        return -1;
    }

    getChunkAtPosition(pos, create = false) {
        return this.getChunk(pos.getFloorX() >> 4, pos.getFloorZ() >> 4, create);
    }

    getChunk(x, z, create = false) {
        let index;
        if (this._chunks.has(index = Level.chunkHash(x, z))) {
            return this._chunks.get(index);
        } else if (this.loadChunk(x, z, create)) {
            return this._chunks.get(index);
        }

        return null;
    }

    actuallyDoTick(currentTick) {
        //this.getServer().getSessionAdapter().test();
    }

    /*doTick(currentTick){
        //console.log(`CurrentTick: ${currentTick}`);
        this.doingTick = true;
        try{
            //this.actuallyDoTick(currentTick);
        }finally {
            this.doingTick = false;
        }
    }

     /*actuallyDoTick(currentTick){
        this..getOnlinePlayers().forEach(player => {
            player.onUpdate(currentTick);
        });
     }*/

    getBlock(pos, cached = true, addToCache = true) {
        return this.getBlockAt(Number(Math.floor(pos.x)), Number(Math.floor(pos.y)), Number(Math.floor(pos.z)), cached, addToCache);
    }

    setBlock(pos, block, direct = false, update = true) {
        // pos = pos.floor(); todo

        if (this.getChunkAtPosition(pos, true).setBlock(pos.x & 0xf, pos.y, pos.z & 0xf, block.getId(), block.getDamage())) {
            if (!(pos instanceof Position)) {
                pos = this._temporalPosition.setComponents(pos.x, pos.y, pos.z);
            }

            block = clone(block);

            block.position(pos);
            block.clearCaches();

            let chunkHash = Level.chunkHash(pos.x >> 4, pos.z >> 4);
            let relativeBlockHash = Level.chunkBlockHash(pos.x, pos.y, pos.z);

            // this is to unset.
            let index = this._blockCache.indexOf(this._blockCache[chunkHash][relativeBlockHash]);
            this._blockCache.splice(index, 1);

            if (direct) {
                //TODO: finish here
            }

        }
    }


    getBlockAt(x, y, z, cached = true, addToCache = true) {
        let fullState = 0;
        let relativeBlockHash = null;
        let chunkHash = Level.chunkHash(x >> 4, z >> 4);

        if (this.isInWorld(x, y, z)) {
            relativeBlockHash = Level.chunkBlockHash(x, y, z);

            if (cached && Isset(this._blockCache[chunkHash][relativeBlockHash])) {
                return this._blockCache[chunkHash][relativeBlockHash];
            }

            let chunk = this._chunks[chunkHash];
            if (chunk !== null) {
                let fullState = chunk.getFullBlock(x & 0x0f, y, z & 0x0f);
            } else {
                addToCache = false;
            }
        }

        let block = Object.assign({}, this._blockStates[fullState & 0xfff]);

        block.x = x;
        block.y = y;
        block.z = z;

        if (addToCache && relativeBlockHash !== null) {
            this._blockCache[chunkHash][relativeBlockHash] = block;
        }

        return block;
    }

    isInWorld(x, y, z) {
        return (
            x <= INT32_MAX && x >= INT32_MIN &&
            y < this._worldHeight && y >= 0 &&
            z <= INT32_MAX && z >= INT32_MIN
        );
    }

    /**
     * @param x {Number}
     * @param z {Number}
     * @param create {Boolean}
     * @return {Boolean}
     */
    loadChunk(x, z, create = true) {
        let chunkHash;
        if (this._chunks.has(chunkHash = Level.chunkHash(x, z))) {
            return true;
        }

        this._chunks.set(chunkHash, this.getGenerator().generateChunk(x, z));

        return true;
    }

    getServer() {
        return this._server;
    }

    getName() {
        return this._name;
    }

    /**
     * @return {Generator}
     */
    getGenerator() {
        return this._generator;
    }
}

module.exports = Level;