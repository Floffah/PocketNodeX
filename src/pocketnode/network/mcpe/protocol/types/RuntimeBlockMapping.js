const Isset = require("../../../../utils/methods/Isset");

const BinaryStream = require("../../../../../binarystream/BinaryStream");

class RuntimeBlockMapping {

    constructor() {
        //NOOP
    }

    static init() {
        this._legacyToRuntimeMap = [];
        this._runtimeToLegacyMap = [];

        let legacyIdMap = require("../../../../resources/block_id_map.json");
        this._compressedTable = require("../../../../resources/required_block_states.json");
        let decompressed = [];

        /*for (const [key, value] in Object.entries(this._compressedTable)){
            console.log(key + " " + value);
        }*/

        Object.keys(this._compressedTable.minecraft).forEach(shortStringId => {
            Object.keys(shortStringId).forEach(state => {
                let name = `minecraft:${shortStringId}`;
                decompressed.push({
                    "name": name,
                    "data": state,
                    "legacy_id": legacyIdMap[name]
                });
            });
        });

        /*Object.keys(this._compressedTable).forEach(prefix => {
           Object.entries(prefix).forEach(entry => {
              console.log(entry);
           });
        });*/


        /*Object.keys(this._compressedTable).forEach(entries => {
             for (let prefix in entries){
                 if (entries.hasOwnProperty(prefix)){
                     Object.keys(entries).forEach(states => {
                        for (let shortStringId in states){
                            if (states.hasOwnProperty(shortStringId)) {
                                Object.keys(states).forEach(state => {
                                   let name = `${prefix}:${shortStringId}`;
                                   decompressed.push({
                                      "name": name,
                                      "data": state,
                                      "legacy_id": legacyIdMap[name]
                                   });
                                });
                            }
                        }
                     });
                 }
             }
        });*/
        this._bedrockKnownStates = decompressed;

        this._bedrockKnownStates.forEach(obj => {
            for (let k in obj) {
                if (obj.hasOwnProperty(k)) {
                    if (obj["data"] > 15) {
                        continue;
                    }

                    this.registerMapping(k, obj["legacy_id"], obj["data"]);
                }
            }
        });

        /*this._bedrockKnownStates.forEach(k => {
            for (let obj in k){
                if (k.hasOwnProperty(obj)){
                    if(Isset(legacyIdMap[obj["name"]])){
                        //continue;
                        this.registerMapping(k, legacyIdMap[obj["name"]], obj["data"]);
                    }
                    
                }
            }
        });*/
    }

    static getBedrockKnownStates() {
        return this._bedrockKnownStates;
    }

    static registerMapping(staticRuntimeId, legacyId, legacyMeta) {
        RuntimeBlockMapping._legacyToRuntimeMap[(legacyId << 4) | legacyMeta] = staticRuntimeId;
        RuntimeBlockMapping._runtimeToLegacyMap[staticRuntimeId] = (legacyId << 4) | legacyMeta;
    }
}

module.exports = RuntimeBlockMapping;