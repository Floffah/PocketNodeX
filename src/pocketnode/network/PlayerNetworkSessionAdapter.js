// const DataPacketReceiveEvent = require("../event/server/DataPacketReceiveEvent");
const DataPacket = require("./mcpe/protocol/DataPacket");
const Player = require("../player/Player");
const ResourcePackChunkDataPacket = require("./mcpe/protocol/ResourcePackChunkDataPacket");

const Chunk = require("../level/format/Chunk");

const TextPacket = require("./mcpe/protocol/TextPacket");

const ResourcePack = require("../resourcepacks/ResourcePack");


const Async = require("../utils/Async");
// const aasync = require('async'); TODO

const PlayStatusPacket = require("./mcpe/protocol/PlayStatusPacket");

class PlayerNetworkSessionAdapter {

    /** @type {boolean} */
    _hasChunks = false;

    constructor(player) {
        /** @type {Server} */
        this.server = player.server;
        /** @type {RakNetAdapter} */
        this.raknetAdapter = this.server.getRakNetAdapter();
        /** @type {Player} */
        this.player = player;
    }

    // sendPacket(packet, needACK = false, immediate = true) {
    //     return this.raknetAdapter.sendPacket(this.player, packet, needACK, immediate);
    // }

    handleDataPacket(packet) {
        CheckTypes([DataPacket, packet]);

        if (!this.player.isConnected()) {
            return;
        }

        packet.decode();

        if (!packet.feof() && !packet.mayHaveUnreadBytes()) {
            let remains = packet.buffer.slice(packet.offset);
            this.server.getLogger().debug("Still " + remains.length + " bytes unread in " + packet.getName() + ": 0x" + remains.toString("hex"));
        }

        //console.log("Got "+packet.getName()+" from "+this);

        packet.handle(this);

        // let ev = new DataPacketReceiveEvent(this.player, packet);
        // this.server.getPluginManager().callEvent(ev);
        // if(!ev.isCancelled() && !packet.handle(this)){
        //     console.log("Unhandled " + packet.getName() + " received from " + this.player.getName() + ": 0x" + packet.buffer.toString("hex"));
        // }
    }

    handleLogin(packet) {
        return this.player.handleLogin(packet);
    }

    handleClientToServerHandshake(packet) {
        return false;
    }

    // resourcepack client response

    //handleText

    //handlePLayerMove

    //handleLevelSoundEventPacket

    handleActorEvent(packet) {
        return this.player.handleEntityEvent(packet);
    }

    handleActorFall(packet) {
        //CheckTypes([ActorFallPacket, packet]);
        return true; // Not used
    }

    handleLevelEvent(packet) {
        return false;
    }

    handlePlayerInput(packet) {
        return false; //TODO
    }

    handleActorPickRequest(packet) {
        //CheckTypes([ActorPickRequestPacket, packet]);
        return false; // TODO
    }

    handleSetLocalPlayerAsInitialized(packet) {
        console.log('init');
        this.player.doFirstSpawn();
        return true;
    }

    handleInventoryTransaction(packet) {
        //TODO
    }

    handlePlayerSkin(packet) {
        return this.player.changeSkin(packet.skin, packet.newSkinName, packet.oldSkinName);
    }

    handleResourcePackClientResponse(packet) {
        this.player.handleResourcePackClientResponse(packet);
    }

    handleResourcePackChunkRequest(packet) {
        let manager = this.server.getResourcePackManager();
        let pack = manager.getPackById(packet.packId);
        //let pack = manager.getPackById(uuid.substr(0), (uuid + "").indexOf("_"));

        if (!(pack instanceof ResourcePack)) {
            this.player.close("", "Resource pack was not found on this server!", true);
            this.server.getLogger().debug("Got a resource pack chunk request for unknown pack with UUID " + packet.packId + ", available packs: " + manager.getPackIdList().join(", "));

            return false;
        }

        let pk = new ResourcePackChunkDataPacket();
        pk.packId = pack.getPackId();
        pk.chunkIndex = packet.chunkIndex;
        pk.data = pack.getPackChunk(1048576 * packet.chunkIndex, 1048576);
        pk.progress = (1048576 * packet.chunkIndex);
        this.player.dataPacket(pk);
        return true;
    }

    handleRequestChunkRadius(packet) {

        console.log("new chunk radius request");

        this.player.setViewDistance(packet.radius);

        Async(function () {
            if (this._hasChunks) return;
            let distance = this.player.getViewDistance();
            for (let chunkX = -distance; chunkX <= distance; chunkX++) {
                for (let chunkZ = -distance; chunkZ <= distance; chunkZ++) {
                    let chunk = new Chunk(chunkX, chunkZ);

                    for (let x = 0; x < 16; x++) {
                        for (let z = 0; z < 16; z++) {
                            let y = 0;
                            chunk.setBlockId(x, y++, z, 7);
                            chunk.setBlockId(x, y++, z, 3);
                            chunk.setBlockId(x, y++, z, 3);
                            chunk.setBlockId(x, y, z, 2);

                            /*for (let i = y - 1; i >= 0; i--) {
                                chunk.setBlockSkyLight(x, y, z, 0);
                            }*/
                        }
                    }

                    chunk.recalculateHeightMap();

                    this._hasChunks = true;
                    this.player.sendChunk(chunk);
                }
            }
        }.bind(this))
            .then(function () {
                console.log("done sending chunks");
                // TODO
                this.player.sendPlayStatus(PlayStatusPacket.PLAYER_SPAWN);
            }.bind(this));
        return true;
    }

    handleLevelSoundEvent(packet) {
        return this.player.handleLevelSoundEvent(packet);
    }

    handleSetTime(packet) {
        return false;
    }

    handleAddPlayer(packet) {
        return false;
    }

    handleMovePlayer(packet) {
        return this.player.handleMovePlayer(packet);
    }

    handlePlayerAction(packet) {
        return this.player.handlePlayerAction(packet);
    }

    handleSubClientLogin(packet) {
        return false;
    }

    handleStructureBlockUpdate() {
        return false;
    }

    handleUpdateBlock(packet) {
        return false;
    }

    handleRiderJump(packet) {
        return false;
    }

    handleMoveActorAbsolute(packet) {
        return false;
    }

    handleBlockEvent(packet) {
        return false;
    }

    handleDisconnect(packet) {
        return false;
    }

    handleRemoveActor(packet) {
        return false;
    }

    handleTickSync(packet) {
        return false;
    }

    handleLevelSoundEventPacketV1(packet) {
        return false;
    }

    handleServerToClientHandshake(packet) {
        return false;
    }

    handleTakeItemActor(packet) {
        return false;
    }

    handleAnimate(packet) {
        return this.player.handleAnimate(packet);
    }

    handleSetEntityData(packet) {
        return false;
    }

    handleUpdateAttributes(packet) {
        return false;
    }

    handleAddBehaviorTree(packet) {
        return false;
    }

    handleAddEntity(packet) {
        return false;
    }

    handleSetDefaultGameType() {
        return this.player.handleSetDefaultGameType(packet);
    }

    handlePlayStatus(packet) {
        return false;
    }

    handleAddPainting(packet) {
        return false;
    }

    handleMobEquipment(packet) {
        this.player.handleMobEquipment(packet);
    }

    handleAdventureSettings(packet) {
        this.player.handleAdventureSettings(packet);
    }

    handleInteract(packet) {
        this.player.handleInteract(packet);
    }

    handleAutomationClientConnect(packet) {
        return false;
    }

    handleMobArmorEquipment(packet) {
        return true;
    }

    handleAvailableCommands(packet) {
        return false;
    }

    handleCommandOutput(packet) {
        return false;
    }

    handleSetTitle(packet) {
        return false;
    }

    handleMobEffect(packet) {
        return false;
    }

    //TODO
    handleBlockPickRequest(packet) {
        this.player.handleBlockPickRequest(packet);
    }

    handleCommandRequest(packet) {
        return this.player.chat(packet.command);
    }

    handleText(packet) {
        if (packet.type === TextPacket.TYPE_CHAT) {
            return this.player.chat(packet.message);
        }

        return false;
    }

    toString() {
        return this.player.getName() !== "" ? this.player.getName() : this.player.getAddress() + ":" + this.player.getPort();
    }
}

module.exports = PlayerNetworkSessionAdapter;