/* Utils */
const UUID = require("../utils/UUID");
const Isset = require("../utils/methods/Isset");
const TextFormat = require("../utils/TextFormat");
const Base64 = require("../utils/Base64");
const SkinAnimation = require("../network/mcpe/protocol/types/SkinAnimation");
const SkinImage = require("../network/mcpe/protocol/types/SkinImage");
const SkinData = require('../network/mcpe/protocol/types/SkinData');
const SkinAdapterSingleton = require('../network/mcpe/protocol/types/SkinAdapterSingleton');
const Chunk = require('../level/format/Chunk');

const Async = require("../utils/Async");

const AddActorPacket = require("../network/mcpe/protocol/AddActorPacket");

// const SerializedImage = require("../utils/SerializedImage");

/* Events */
const PlayerJoinEvent = require("../event/player/PlayerJoinEvent");
const PlayerQuitEvent = require("../event/player/PlayerQuitEvent");

/* Attributes */
const Attribute = require("../entity/Attribute");

/* Packets */
const AdventureSettingsPacket = require("../network/mcpe/protocol/AdventureSettingsPacket");
const ResourcePackClientResponsePacket = require("../network/mcpe/protocol/ResourcePackClientResponsePacket");
const ResourcePackDataInfoPacket = require("../network/mcpe/protocol/ResourcePackDataInfoPacket");
const ResourcePackStackPacket = require("../network/mcpe/protocol/ResourcePackStackPacket");
const PlayerSessionAdapter = require("../network/PlayerNetworkSessionAdapter");
const DataPacket = require("../network/mcpe/protocol/DataPacket");
const AnimatePacket = require("../network/mcpe/protocol/AnimatePacket");
const BiomeDefinitionListPacket = require("../network/mcpe/protocol/BiomeDefinitionListPacket");
const AvailableActorIdentifiersPacket = require("../network/mcpe/protocol/AvailableActorIdentifiersPacket");
const InteractPacket = require("../network/mcpe/protocol/InteractPacket");
const PlayerActionPacket = require("../network/mcpe/protocol/PlayerActionPacket");
const LoginPacket = require("../network/mcpe/protocol/LoginPacket");
const PlayStatusPacket = require("../network/mcpe/protocol/PlayStatusPacket");
const UpdateAttributesPacket = require("../network/mcpe/protocol/UpdateAttributesPacket");
const DisconnectPacket = require("../network/mcpe/protocol/DisconnectPacket");
const MovePlayerPacket = require("../network/mcpe/protocol/MovePlayerPacket");
const ResourcePacksInfoPacket = require("../network/mcpe/protocol/ResourcePacksInfoPacket");
const StartGamePacket = require("../network/mcpe/protocol/StartGamePacket");
const ChunkRadiusUpdatedPacket = require("../network/mcpe/protocol/ChunkRadiusUpdatedPacket");
const TextPacket = require("../network/mcpe/protocol/TextPacket");
const LevelChunkPacket = require("../network/mcpe/protocol/LevelChunkPacket");
const SetPlayerGameTypePacket = require("../network/mcpe/protocol/SetPlayerGameTypePacket");
const AvailableCommandsPacket = require("../network/mcpe/protocol/AvailableCommandsPacket");
const SetTitlePacket = require("../network/mcpe/protocol/SetTitlePacket");
const ActorEventPacket = require("../network/mcpe/protocol/ActorEventPacket");

/* Commands */
const CommandData = require("../network/mcpe/protocol/types/CommandData");
const CommandParameter = require("../network/mcpe/protocol/types/CommandParameter");
const CommandEnum = require("../network/mcpe/protocol/types/CommandEnum");
const CommandSender = require("../command/CommandSender");

/* Level */
const GameRule = require("../level/GameRule");

/* Math */
const Vector3 = require("../math/Vector3");
const AxisAlignedBB = require("../math/AxisAlignedBB");

/* Entity */
const Human = require("../entity/Human");
const Skin = require("../entity/Skin");

const ResourcePack = require("../resourcepacks/ResourcePack");

/**
 * Main class that handles networking, recovery, and packet sending to the server part
 */
class Player extends Human {
    constructor(sourceInterface, server, clientId, ip, port) {
        super(server);
        this.initVars();
        this._interface = sourceInterface;
        this.server = server;
        this._clientId = clientId;
        this._ip = ip;
        this._port = port;
        this.creationTime = Date.now();
        this.level = server.getDefaultLevel();

        //this.namedtag = new CompoundTag();
        this._boundingBox = new AxisAlignedBB(0, 0, 0, 0, 0, 0, 0);
        //
        // this._uuid = null;
        // this._rawUUID = null;

        //TODO: this.onGround = this.namedtag.getByte("onGround", 0) !== 0;

        this._sessionAdapter = new PlayerSessionAdapter(this);
        this.lastUpdate = this.server.getTick();
    }

    static get SURVIVAL() {
        return 0
    }

    static get CREATIVE() {
        return 1
    }

    static get ADVENTURE() {
        return 2
    }

    static get SPECTATOR() {
        return 3
    }

    static get VIEW() {
        return Player.SPECTATOR
    }

    /**
     * Validates the given username.
     *
     * @param name {string}
     *
     * @return {boolean}
     */
    static isValidUserName(name) {
        if (name == null) {
            return false;
        }

        return name.toLowerCase() !== "rcon" && name.toLowerCase() !== "console" && name.length >= 1 && name.length <= 16 && /[^A-Za-z0-9_ ]/.test(name);
    }

    static getClientFriendlyGamemode(gamemode) {
        gamemode &= 0x03;
        if (gamemode === Player.SPECTATOR) {
            return Player.CREATIVE;
        }

        return gamemode;
    }

    initVars() {

        //TODO: /** @type {SourceInterface} */
        this._interface = null;
        this._sessionAdapter = null;
        this._ip = "";
        this._port = 0;
        this._needACK = {};
        this._batchedPackets = [];
        this._lastPingMeasure = 1;
        this.creationTime = 0;
        this.loggedIn = false;
        this.spawned = false;
        this._username = "";
        this._iusername = "";
        this._displayName = "";
        this._randomClientId = -1;
        this._xuid = "";
        this._windowCnt = 2;
        this._windows = [];
        this._windowIndex = [];
        this._permanentWindows = [];
        this._cursorInventory = null;
        this._craftingGrid = null;
        this._craftingTransaction = null;
        this._messageCounter = 2;
        this._removeFormat = true;
        this._achievements = [];
        this._playedBefore = false;
        this._gamemode = 0;
        this._loaderId = 0;
        this.usedChunks = {};
        this._loadQueue = {};
        this._nextChunkOrderRun = 5;
        this._hiddenPlayers = {};
        this._newPosition = null;
        this._isTeleporting = false;
        this._isAirTicks = 0;
        this._stepHeight = 0.6;
        this._allowMovementCheats = false;
        this._sleeping = null;
        this._spawnPosition = null;
        this._autoJump = true;
        this._allowFlight = false;
        this._flying = false;

        this._perm = null;

        this._lineHeight = null;
        this._locale = "en_US";

        this._startAction = -1;
        this._usedItemsCooldown = {};

        this._formIdCounter = 0;
        this._forms = [];
        this._lastRightClickTime = 0.0;
        this._lastRightClickPos = null;
    }

    /**
     * @return {string}
     */
    getLeaveMessage() {
        if (this.joined) {
            return TextFormat.YELLOW + this.getName() + " has left the game";
        }
        return "";
    }

    /**
     * This might disappear in the future. Please use getUniqueId() instead.
     * @deprecated
     *
     * @return {number}
     */
    getClientId() {
        return this._randomClientId;
    }

    /**
     * @return {boolean}
     */
    isBanned() {
        this.server.getNameBans().isBanned(this._username);
    }

    /**
     * @param value {boolean}
     */
    // setBanned(value) {
    //     if (value) {
    //         this.server.getNameBans().addBan(this.getName(), null, null, null);
    //         this.kick("You have been banned");
    //     } else {
    //         this.server.getNameBans().remove(this.getName());
    //     }
    // }

    /**
     * @return {boolean}
     */
    isWhitelisted() {
        return this.server.isWhitelisted(this._username);
    }

    /**
     * @param value {boolean}
     */
    // setWhitelisted(value) {
    //     if (value) {
    //         this.server.addWhitelist(this._username);
    //     } else {
    //         this.server.removeWhitelist(this._username);
    //     }
    // }

    /**
     * @return {boolean}
     */
    isAuthenticated() {
        return this._xuid !== "";
    }

    /**
     * If the player is logged into Xbox Live, returns their Xbox user ID (XUID) as a string. Returns an empty string if
     * the player is not logged into Xbox Live.
     * @return {string}
     */
    getXuid() {
        return this._xuid;
    }

    /**
     * Returns the player's UUID. This should be preferred over their Xbox user ID (XUID) because UUID is a standard
     * format which will never change, and all players will have one regardless of whether they are logged into Xbox
     * Live.
     *
     * The UUID is comprised of:
     * - when logged into XBL: a hash of their XUID (and as such will not change for the lifetime of the XBL account)
     * - when NOT logged into XBL: a hash of their name + clientID + secret device ID.
     *
     * WARNING: UUIDs of players **not logged into Xbox Live** CAN BE FAKED and SHOULD NOT be trusted!
     *
     * (In the olden days this method used to return a fake UUID computed by the server, which was used by plugins such
     * as SimpleAuth for authentication. This is NOT SAFE anymore as this UUID is now what was given by the client, NOT
     * a server-computed UUID.)
     *
     * @return {UUID|null}
     */
    getUniqueId() {
        return super.getUniqueId();
    }

    /**
     * @return {Player}
     */
    getPlayer() {
        return this;
    }

    getFirstPlayed() {
        return this.name
    }

    isConnected() {
        return this._sessionAdapter !== null;
    }

    hasPlayedBefore() {
        return this._playedBefore;
    }

    getName() {
        return this._username;
    }

    getLowerCaseName() {
        return this._iusername;
    }

    getAddress() {
        return this._ip;
    }

    getPort() {
        return this._port;
    }

    handleLogin(packet) {

        if (this.loggedIn) {
            return false;
        }

        /*if(packet.protocol] !== MinecraftInfo.PROTOCOL){
            if(packet.protocol < MinecraftInfo.PROTOCOL){
                this.sendPlayStatus(PlayStatusPacket.LOGIN_FAILED_CLIENT, true);
            }else{
                this.sendPlayStatus(PlayStatusPacket.LOGIN_FAILED_SERVER, true);
            }

            this.close("", "Incompatible Protocol", false);

            return true;
        }*/

        /*if (Player.isValidUserName(packet.username)) {
            this.close("", "Invalid Username");
            return true;
        }*/

        this._username = TextFormat.clean(packet.username);
        this._displayName = this._username;
        this._iusername = this._username.toLowerCase();

        if (packet.locale !== null) {
            this.locale = packet.locale;
        }

        if (this.server.isFull() && this.kick("Server Full", false)) {
            return true;
        }

        this._randomClientId = packet.clientId;

        this._uuid = UUID.fromString(packet.clientUUID);
        // this._rawUUID = this._uuid.toBinary(); to fix

        let animations = [];
        packet.clientData['AnimatedImageData'].forEach(animation => {
            animations.push(new SkinAnimation(new SkinImage(
                animation['ImageHeight'],
                animation['ImageWidth'],
                Base64.decode(animation['Image'], true)),
                animation['Type'], animation['Frames']
            ));
        });

        let skinData = new SkinData(
            packet.clientData['SkinId'],
            Base64.decode(packet.clientData['SkinResourcePatch'] || "", true),
            new SkinImage(packet.clientData['SkinImageHeight'], packet.clientData['SkinImageWidth'], Base64.decode(packet.clientData['SkinData'], true)),
            animations,
            new SkinImage(packet.clientData['CapeImageHeight'], packet.clientData['CapeImageWidth'], Base64.decode(packet.clientData['CapeData'] || "", true)),
            Base64.decode(packet.clientData['SkinGeometryData'] || "", true),
            Base64.decode(packet.clientData['SkinAnimationData'] || "", true),
            packet.clientData['PremiumSkin'] || false,
            packet.clientData['PersonaSkin'] || false,
            packet.clientData['CapeOnClassicSkin'] || false,
            packet.clientData['CapeId'] || ""
        );

        let skin = SkinAdapterSingleton.get().fromSkinData(skinData);

        if (!skin.isValid()) {
            this.close("", "Invalid Skin");
            return true;
        }

        this.setSkin(skin);

        // let ev = new PlayerPreLoginEvent(this, "Test");
        // this.server.getPluginManager().callEvent(ev);

        // if (ev.isCancelled()) {
        //      this.close("", ev.getKickMessage());
        //      return true;
        //  }

        //this.server._whitelist
        //todo: if whitelisted/banned kick

        /*if (!packet.skipVerification){
            //todo: transfer code here from async comment
            this.onVerifyCompleted(packet, null, true); //todo: momentanely fix
        }else{
            this.onVerifyCompleted(packet, null, true);
        }*/

        this.onVerifyCompleted(packet, null, true);

        return true;
    }

    doFirstSpawn() {
        this.spawned = true;

        //this.sendPlayStatus(PlayStatusPacket.PLAYER_SPAWN);

        // let ev = new PlayerJoinEvent(this, "test");
        // this.server.getPluginManager().callEvent(ev);
        //
        // if (ev.getJoinMessage().length > 0){
        //     this.server.broadcastMessage(ev.getJoinMessage());
        // }

        this.noDamageTicks = 60;
    }

    onVerifyCompleted(packet, error, signedByMojang) {
        if (this.closed) return;

        if (error !== null) {
            this.close("", "Invalid Session");
            return;
        }

        let xuid = packet.xuid;

        if (!signedByMojang && xuid !== "") {
            this.server.getLogger().info(this.getName() + " has an XUID, but their login keychain is not signed by Mojang");
            xuid = "";
        }

        if (xuid === "" || !xuid instanceof String) {
            if (signedByMojang) {
                this.server.getLogger().error(this.getName() + " should have an XUID, but none found");
            }

            if (this.server.requiresAuthentication() && this.kick("This server requires authentication.", false)) {
                return;
            }

            this.server.getLogger().debug(this.getName() + " is NOT logged into Xbox Live");
        } else {
            this.server.getLogger().debug(this.getName() + " is logged into Xbox Live");
            this._xuid = xuid;
        }

        //TODO: encryption

        this._processLogin();
    }

    _processLogin() {
        // for (let [, p] of this.server._loggedInPlayers) {
        //     if (p !== this && p._iusername === this._iusername) {
        //         if (p.kick("Logged in from another location") === false) {
        //             this.close(this.getLeaveMessage(), "Logged in from another location");
        //             return;
        //         }
        //     } else if (p.loggedIn/* && uuids equal*/) {
        //         if (p.kick("Logged in from another location") === false) {
        //             this.close(this.getLeaveMessage(), "Logged in from another location");
        //             return;
        //         }
        //     }
        // }

        this.sendPlayStatus(PlayStatusPacket.LOGIN_SUCCESS);

        this.loggedIn = true;
        this.server.onPlayerLogin(this);
        console.log("Player logged in: " + this._username);

        let pk = new ResourcePacksInfoPacket();
        pk.resourcePackEntries = [];
        pk.mustAccept = false;
        this.dataPacket(pk);
    }

    sendPlayStatus(status, immediate = false) {
        let pk = new PlayStatusPacket();
        pk.status = status;
        if (immediate) {
            this.directDataPacket(pk);
        } else {
            this.dataPacket(pk);
        }
    }

    /**
     *
     * @param skin {Skin}
     * @param newSkinName {string}
     * @param oldSkinName {string}
     */
    changeSkin(skin, newSkinName, oldSkinName) {
        if (!skin.isValid()) {
            return false;
        }

        //TODO: finish handle
    }

    dataPacket(packet, needACK = false) {
        return this.sendDataPacket(packet, needACK, false);
    }

    directDataPacket(packet, needACK = false) {
        return this.sendDataPacket(packet, needACK, true);
    }

    sendDataPacket(packet, needACK = false, immediate = false) {
        if (!this.isConnected()) return false;

        if (!this.loggedIn && !packet.canBeSentBeforeLogin()) {
            throw new Error("Attempted to send " + packet.getName() + " to " + this.getName() + " before they got logged in.");
        }

        // let ev = new DataPacketSendEvent(this, packet);
        // this.server.getPluginManager().callEvent(ev);
        // if(ev.isCancelled()){
        //     return false;
        // }

        let identifier = this._interface.putPacket(this, packet, needACK, immediate);

        if (needACK && identifier !== null) {
            this._needACK[identifier] = false;
            return identifier;
        }

        return true;
    }

    kick(reason = "", isAdmin = true) {
        let message;
        if (isAdmin) {
            if (true) {//todo: not is banned
                message = "Kicked by admin." + (reason !== "" ? " Reason: " + reason : "");
            } else {
                message = reason;
            }
        } else {
            if (reason === "") {
                message = "Unknown Reason.";
            } else {
                message = reason;
            }
        }

        this.close(reason, message);
    }

    /**
     * Adds a title text to the user's screen, with an optional subtitle.
     *
     * @param title {string}
     * @param subtitle {string}
     * @param fadeIn {number} Duration in ticks for fade-in. If -1 is given, client-sided defaults will be used.
     * @param stay {number} Duration in ticks to stay on screen for
     * @param fadeOut {number} Duration in ticks for fade-out.
     */
    addTitle(title, subtitle = "", fadeIn = -1, stay = -1, fadeOut = -1) {
        this.setTitleDuration(fadeIn, stay, fadeOut);
        if (subtitle !== "") {
            this.addSubTitle(subtitle);
        }
        this.sendTitleText(title, SetTitlePacket.TYPE_SET_TITLE);
    }

    /**
     * Sets the subtitle message, without sending a title.
     *
     * @param subtitle {string}
     */
    addSubTitle(subtitle) {
        this.sendTitleText(subtitle, SetTitlePacket.TYPE_SET_SUBTITLE);
    }

    /**
     * Adds small text to the user's screen.
     *
     * @param message {string}
     */
    addActionBarMessage(message) {
        this.sendTitleText(message, SetTitlePacket.TYPE_SET_ACTIONBAR_MESSAGE);
    }

    /**
     * Removes the title from the client's screen.
     */
    removeTitles() {
        let pk = new SetTitlePacket();
        pk.type = SetTitlePacket.TYPE_CLEAR_TITLE;
        this.dataPacket(pk);
    }

    /**
     * Resets the title duration settings to defaults and removes any existing titles.
     */
    resetTitles() {
        let pk = new SetTitlePacket();
        pk.type = SetTitlePacket.TYPE_RESET_TITLE;
        this.dataPacket(pk);
    }

    setTitleDuration(fadeIn, stay, fadeOut) {
        if (fadeIn >= 0 && stay >= 0 && fadeOut >= 0) {
            let pk = new SetTitlePacket();
            pk.type = SetTitlePacket.TYPE_SET_ANIMATION_TIMES;
            pk.fadeInTime = fadeIn;
            pk.stayTime = stay;
            pk.fadeOutTime = fadeOut;
            this.dataPacket(pk);
        }
    }

    sendSpawnPacket(player){
        let pk = new AddActorPacket();
        pk.entityRuntimeId = this.id;
        pk.type = 63;
        pk.position = this.asVector3();
        pk.motion = this._motion;
        pk.yaw = this.yaw;
        pk.headYaw = this.yaw;
        pk.pitch = this.pitch;
        pk.attributes = [];
        pk.metadata = this._propertyManager.getAll();

        player.dataPacket(pk);
    }

    close(message, reason = "generic reason", notify = true) {
        if (this.isConnected() && !this.closed) {
            try {
                if (notify && reason.length > 0) {
                    let pk = new DisconnectPacket();
                    pk.message = reason;
                    this.directDataPacket(pk);
                }

                this._sessionAdapter = null;

                //unsub from perms?
                //stopsleep

                if (this.joined) {
                    try {
                        //save player data
                    } catch (e) {
                        this.server.getLogger().error("Failed to save player data for " + this.getName());
                        this.server.getLogger().logError(e);
                    }

                    //tell server player left the game
                }
                this.joined = false;

                //if valid do chuck stuff

                if (this.loggedIn) {
                    this.server.onPlayerLogout(this);
                    //can see etc
                }

                this.spawned = false;

                let ev = new PlayerQuitEvent(this, "A Player quit due to " + reason, reason);
                this.server.getEventSystem().callEvent(ev);
                if (ev.getQuitMessage().length > 0) {
                    let message = ev.getQuitMessage();
                    this.server.broadcastMessage(message);
                } else {
                    this.server.getLogger().warning("Player quit message is blank or null.");
                }

                this.server.getLogger().info(TextFormat.AQUA + this.getName() + TextFormat.WHITE + " (" + this._ip + ":" + this._port + ") has disconnected due to " + reason);

                if (this.loggedIn) {
                    this.loggedIn = false;
                    this.server.removeOnlinePlayer(this);
                }
            } catch (e) {
                this.server.getLogger().logError(e);
            } finally {
                this.server.getRakNetAdapter().close(this, notify ? reason : "");
                this.server.removePlayer(this);
            }
        }
    }

    setViewDistance(distance) {
        this._viewDistance = distance;

        let pk = new ChunkRadiusUpdatedPacket();
        pk.radius = this._viewDistance;
        this.dataPacket(pk);

        console.log("Setting view distance for " + this.getName() + " to " + distance);
    }

    getViewDistance() {
        return this._viewDistance;
    }

    completeLoginSequence() {

        //let pos = this.namedtag.getListTag("Pos").getAllValues();
        //this.usedChunks[Level.chunkHash(pos[0] >> 4, pos[2]) >> 4] = false;

        let pk = new StartGamePacket();
        // pk.entityUniqueId = this.id;
        // pk.entityRuntimeId = this.id;
        // pk.playerGamemode = Player.getClientFriendlyGamemode(this.gamemode);
        //
        // pk.playerPosition = new Vector3(0, 5.5, 0);
        //
        // pk.pitch = this._pitch;
        // pk.yaw = this._yaw;
        // pk.seed = 0xdeadbeef;
        // pk.dimension = 0; //TODO
        // pk.levelGamemode = this.server.getGamemode();
        // pk.difficulty = 1; //TODO
        // [pk.spawnX, pk.spawnY, pk.spawnZ] = [0, 6.5, 0];
        // pk.hasAchievementsDisabled = true;
        // pk.time = 0;
        // pk.eduEditionOffer = 0;
        // pk.rainLevel = 0;
        // pk.lightningLevel = 0;
        // pk.commandsEnabled = true;
        // pk.levelId = "";
        // pk.levelName = this.server.getMotd();
        // pk.gameRules = [
        //     new GameRule(GameRule.COMMAND_BLOCK_OUTPUT, true),
        //     new GameRule(GameRule.DO_DAYLIGHT_CYCLE, true),
        //     new GameRule(GameRule.DO_ENTITY_DROPS, true),
        //     new GameRule(GameRule.DO_FIRE_TICK, true),
        //     new GameRule(GameRule.DO_MOB_LOOT, true),
        //     new GameRule(GameRule.DO_MOB_SPAWNING, true),
        //     new GameRule(GameRule.DO_TILE_DROPS, true),
        //     new GameRule(GameRule.DO_WEATHER_CYCLE, true),
        //     new GameRule(GameRule.DROWNING_DAMAGE, true),
        //     new GameRule(GameRule.FALL_DAMAGE, true),
        //     new GameRule(GameRule.FIRE_DAMAGE, true),
        //     new GameRule(GameRule.KEEP_INVENTORY, false),
        //     new GameRule(GameRule.MOB_GRIEFING, true),
        //     new GameRule(GameRule.NATURAL_REGENERATION, true),
        //     new GameRule(GameRule.PVP, true),
        //     new GameRule(GameRule.SEND_COMMAND_FEEDBACK, true),
        //     new GameRule(GameRule.SHOW_COORDINATES, true),
        //     new GameRule(GameRule.RANDOM_TICK_SPEED, 3),
        //     new GameRule(GameRule.TNT_EXPLODES, true)
        // ];
        this.dataPacket(pk);

        this.sendDataPacket(new AvailableActorIdentifiersPacket());
        this.sendDataPacket(new BiomeDefinitionListPacket());

        // this.level.sendTime(this);

        // this.sendPlayStatus(PlayStatusPacket.PLAYER_SPAWN, true);

        this.sendAttributes(true);

        this.server.getLogger().info([
            TextFormat.AQUA + this.getName() + TextFormat.WHITE + " (" + this._ip + ":" + this._port + ")",
            "is attempting to join"
        ].join(" "));

        //this.sendCommandData();
        this.sendSettings();  // TODO: if i send this, i cannot see blocks
        // this.sendPotionEffects(this);

        // this._sendAllInventories();

        this.server.addOnlinePlayer(this);
        this.server.onPlayerCompleteLoginSequence(this);

        // this.server.sendFullPlayerListData(this);

        // this.sendPlayStatus(PlayStatusPacket.PLAYER_SPAWN);

        let ev = new PlayerJoinEvent(this, TextFormat.YELLOW + this.getName() + " joined the game");
        this.server.getEventSystem().callEvent(ev);
        if (ev.getJoinMessage().length > 0) {
            this.server.broadcastMessage(ev.getJoinMessage());
        } else {
            this.server.getLogger().warning("Player join message is blank or null.");
        }
        
        // spawn to all
        // this.server._playerList.forEach(player => {
        //     if (player === this) return;
        //     this.sendSpawnPacket(player);
        // });
    }

    sendCommandData() {
        let pk = new AvailableCommandsPacket();
        this.server.getCommandMap().getCommands().forEach(command => {
            for (let name in command) {
                if (command.hasOwnProperty(name)) {
                    if (Isset(pk.commandData[command.getName()]) || command.getName() === "help") {
                        continue;
                    }

                    let data = new CommandData();
                    //TODO: commands containing uppercase letters in the name crash 1.9.0 client
                    data.commandName = command.getName().toLowerCase();
                    data.commandDescription = command.getDescription();
                    data.flags = 0;
                    data.permission = 0;

                    let parameter = new CommandParameter();
                    parameter.paramName = "args";
                    parameter.paramType = AvailableCommandsPacket.ARG_FLAG_VALID | AvailableCommandsPacket.ARG_TYPE_RAWTEXT;
                    parameter.isOptional = true;
                    data.overloads[0] = [];
                    data.overloads[0][0] = parameter;

                    let aliases = command.getAliases();
                    if (aliases.length !== 0) {
                        if (aliases.indexOf(data.commandName) === -1) {
                            //work around a client bug which makes the original name not show when aliases are used
                            aliases.push(data.commandName);
                        }
                        data.aliases = new CommandEnum();
                        data.aliases.enumName = command.getName().charAt(0).toUpperCase() + command.getName().substring(1) + "Aliases";
                        data.aliases.enumValues = aliases;
                    }

                    pk.commandData[command.getName()] = data;
                }
            }
        });

        this.dataPacket(pk);
    }

    chat(message) {
        message = TextFormat.clean(message, false);//this._removeFormat);

        message = message.split("\n");
        for (let i in message) {
            let messagePart = message[i];
            if (messagePart.trim() !== "" && messagePart.length <= 255) {// && this.messageCounter-- > 0){
                if (messagePart.startsWith("./")) {
                    messagePart = messagePart.substr(1);
                }

                if (messagePart.startsWith("/")) {
                    this.server.getCommandMap().dispatchCommand(this, messagePart.substr(1));
                } else {
                    let msg = "<:player> :message".replace(":player", this.getName()).replace(":message", messagePart);
                    this.server.getLogger().info(msg);
                    this.server.broadcastMessage(msg);
                }
            }
        }

        return true;
    }

    handleAdventureSettings(packet) {
        //TODO
    }

    handleLevelSoundEvent(packet) {
        //this.server.getDefaultLevel().addChunkPacket  //TODO: send packet to all players in chunk radius
        this.dataPacket(packet);
        return true
    }

    handleMovePlayer(packet) {

        let newPos = packet.position.subtract(0, this._baseOffset, 0);

        /*if (newPos.distanceSquared(this) > 1) {
            this.sendPosition(this, null, null, MovePlayerPacket.MODE_RESET);
        }*/ //TODO

        packet.yaw = Math.fmod(packet.yaw, 360);
        packet.pitch = Math.fmod(packet.pitch, 360);

        if (packet.yaw < 0) {
            packet.yaw += 360;
        }

        this.setRotation(packet.yaw, packet.pitch);
        this.newPosition = newPos;
        return true;
    }

    // TODO: handle
    handleAnimate(packet) {
        if (this.spawned === false) {
            return true;
        }

        // let ev = new PlayerAnimationEvent(this, packet.action);
        // this.server.getPluginManager().callEvent(ev);
        // if(ev.isCancelled()){
        //     return true;
        // }

        // let pk = new AnimatePacket();
        // pk.entityRuntimeId = this.id;
        // pk.action = 1; //TODO
        // pk.action = ev.getAnimationType();
        //TODO: edit method of all players and get just this.getViewers();
        // this.server.broadcastPackets(this.server.getOnlinePlayers(), pk);
    }

    handleResourcePackClientResponse(packet) {

        // console.log("Got a new resource pack response with status: " + packet.status);

        let pk, manager;
        // console.log("Status:", ResourcePackClientResponsePacket.STATUS(packet.status));

        switch (packet.status) {
            case ResourcePackClientResponsePacket.STATUS_REFUSED:
                this.player.close("", "You must accept resource packs to join this server.", true);
                break;

            case ResourcePackClientResponsePacket.STATUS_SEND_PACKS:
                manager = this.server.getResourcePackManager();

                packet.packIds.forEach(uuid => {
                    //dirty hack for mojang's dirty hack for versions
                    let slitPos = uuid.indexOf("_");
                    if (slitPos !== false) {
                        uuid = uuid.slice(uuid, 0, slitPos);
                    }

                    let pack = manager.getPackById(uuid);

                    if (!(pack instanceof ResourcePack)) {
                        this.player.close("", "Resource Pack is not on this server", true);
                        console.log("Got a resource pack request for unknown pack with UUID " + uuid + ", available packs: " + manager.getPackIdList().join(", "));
                        return false;
                    }

                    let pk = new ResourcePackDataInfoPacket();
                    pk.packId = pack.getPackId();
                    pk.maxChunkSize = 1048576;
                    pk.chunkCount = Math.ceil(pack.getPackSize() / pk.maxChunkSize);
                    pk.compressedPackSize = pack.getPackSize();
                    pk.sha256 = pack.getSha256();
                    this.dataPacket(pk);
                });

                break;

            case ResourcePackClientResponsePacket.STATUS_HAVE_ALL_PACKS:
                pk = new ResourcePackStackPacket();
                pk.resourcePackStack = [];
                pk.mustAccept = false;
                // manager = this.server.getResourcePackManager();
                // pk.resourcePackStack = manager.getResourcePacks();
                // pk.mustAccept = manager.resourcePacksRequired();
                this.dataPacket(pk);
                break;

            case ResourcePackClientResponsePacket.STATUS_COMPLETED:
                this.completeLoginSequence();
                break;

            default:
                return false;
        }
        return true;
    }

    handleEntityEvent(packet) {
        if (!this.spawned) { //|| !this.isAlive()
            return true;
        }

        //TODO: this.doCloseInventory();

        switch (packet.event) {
            case ActorEventPacket.EATING_ITEM:
                if (packet.data === 0) {
                    return false;
                }

                this.dataPacket(packet);
                //TODO this.server.broadcastPacket();
                break;
            default:
                return true;
        }

        return true;
    }

    //call every tick
    processMovement() {
        let newPos = this.newPosition;
        //let distanceSquared = newPos.distanceSquared(this);

        //let dx = newPos.getX() - this.newPosition.getX();
        //let dy = newPos.getY() - this.newPosition.getY();
        //let dz = newPos.getZ() - this.newPosition.getZ();

        //this.move(dx, dy, dz);
        //TODO
        // this.setPosition(newPos);
    }

    //Bypass Attribute class problems

    onUpdate(currentTick) {
        if (!this.loggedIn) {
            return false;
        }

        let tickDiff = currentTick - this.lastUpdate;

        if (tickDiff <= 0) {
            return true;
        }

        this.messageCounter = 2;

        this.lastUpdate = currentTick;

        // this.sendAttributes();
        this.processMovement();
        //this.processChunkRrquest();
    }

    //TODO: find another way. this is just a workaround!
    sendAttributes(sendAll = false) {
        // let entries = sendAll ? this.attributeMap.getAll() : this.attributeMap.needSend();
        //TODO: test.
        let pk = new UpdateAttributesPacket();
        pk.entityRuntimeId = this.id;
        pk.entries = [
            new Attribute(0, "minecraft:absorption", 0.00, 340282346638528859811704183484516925440.00, 0.00, true),
            new Attribute(1, "minecraft:player.saturation", 0.00, 20.0, 20.0, true),
            new Attribute(2, "minecraft:player.exhaustion", 0.00, 5.00, 0.0, false),
            new Attribute(3, "minecraft:knockback_resistance", 0.00, 1.00, 0.00, true),
            new Attribute(4, "minecraft:health", 0.00, 20.00, 20.00, true),
            new Attribute(5, "minecraft:movement", 0.00, 340282346638528859811704183484516925440.00, 0.10, true),
            new Attribute(6, "minecraft:follow_range", 0.00, 2048.00, 16.00, false),
            new Attribute(7, "minecraft:player.hunger", 0.00, 20.00, 20.00, true),
            new Attribute(8, "minecraft:attack_damage", 0.00, 340282346638528859811704183484516925440.00, 1.00, false),
            new Attribute(9, "minecraft:player.level", 0.00, 24791.00, 0.00, true),
            new Attribute(10, "minecraft:player.experience", 0.00, 1.00, 0.00, true),
            new Attribute(11, "minecraft:underwater_movement", 0.0, 340282346638528859811704183484516925440.0, 0., true),
            new Attribute(12, "minecraft:luck", -1024.0, 1024.0, 0.0, true),
            new Attribute(13, "minecraft:fall_damage", 0.0, 340282346638528859811704183484516925440.0, 1.0, true),
            new Attribute(14, "minecraft:horse.jump_strength", 0.0, 2.0, 0.7, true),
            new Attribute(15, "minecraft:zombie.spawn_reinforcements", 0.0, 1.0, 0.0)
        ];
        this.dataPacket(pk);

        /*if (entries.length > 0){
            let pk = new UpdateAttributesPacket();
            pk.entityRuntimeId = this.id;
            pk.entries = entries;
            this.dataPacket(pk);
            entries.forEach(entry => {
               entry.markSynchronized();
            });
        }*/

        //TODO: fix Attribute class and call attribute.init to make it working
        // let pk = new UpdateAttributesPacket();
        // pk.entityRuntimeId = this.id;
        // pk.entries = entries;
        // this.dataPacket(pk);
        // entries.forEach(entry => {
        //     entry.markSynchronized();
        // });
    }

    sendPosition(pos, yaw = null, pitch = null, mode = MovePlayerPacket.MODE_NORMAL, targets = null) {
        // let playerYaw = (yaw ?? this._yaw);
        let playerYaw = this._yaw;
        // let playerPitch = (pitch ?? this._pitch);
        let playerPitch = this._pitch;

        let fixedpos = pos + 0.001;

        let pk = new MovePlayerPacket();
        pk.entityRuntimeId = this.getId();
        pk.position = fixedpos;
        pk.pitch = playerPitch;
        pk.yaw = playerYaw;
        pk.headYaw = playerYaw;
        pk.mode = mode;

        if (targets !== null) {
            this.server.broadcastPackets(pk, targets);
        } else {
            this.dataPacket(pk);
        }

        this.newPosition = null;
    }

    getId() {
        return this._randomClientId;
    }

    handleSetDefaultGameType(packet) {
        return false;
    }

    handleSetPlayerGameType(packet) {
        if (packet.gamemode !== this.gamemode) {
            this.sendGameMode();
            this.sendSettings();
        }
    }

    sendGameMode() {
        let pk = new SetPlayerGameTypePacket();
        pk.gamemode = Player.getClientFriendlyGamemode(this.gamemode);
        this.dataPacket(pk);
    }

    sendSettings() {
        let pk = new AdventureSettingsPacket();

        pk.setFlag(AdventureSettingsPacket.WORLD_IMMUTABLE, this.isSpectator());
        pk.setFlag(AdventureSettingsPacket.NO_PVP, this.isSpectator());
        pk.setFlag(AdventureSettingsPacket.AUTO_JUMP, this._autoJump);
        pk.setFlag(AdventureSettingsPacket.ALLOW_FLIGHT, this._allowFlight);
        pk.setFlag(AdventureSettingsPacket.NO_CLIP, this.isSpectator());
        pk.setFlag(AdventureSettingsPacket.FLYING, this._flying);

        //TODO Op system.
        pk.commandPermission = AdventureSettingsPacket.PERMISSION_NORMAL;
        pk.playerPermission = 0; //TODO: PlayerPermission
        pk.entityUniqueId = this.id;

        this.dataPacket(pk);
    }

    _sendAllInventories() {
        this._windowIndex.forEach(id => {
            for (let inventory in id) {
                if (id.hasOwnProperty(inventory)) {
                    inventory.sendContents(this);
                }
            }
        });
    }

    /**
     * @return {boolean}
     */
    isSpectator() {
        return this._gamemode === Player.SPECTATOR;
    }

    handlePlayerAction(packet) {
        if (packet.action === PlayerActionPacket.ACTION_RESPAWN && packet.action === PlayerActionPacket.ACTION_DIMENSION_CHANGE_REQUEST) {
            return true;
        }

        packet.entityRuntimeId = this.id; //IDK
        let pos = new Vector3(packet.x, packet.y, packet.z);

        switch (packet.action) {
            case PlayerActionPacket.ACTION_START_BREAK:
                if (pos.distanceSquared(this) > 10000) {
                    break;
                }

            //TODO
            // let target = this.server.getDefaultLevel().getBlock(pos);

            // let ev = new PlayerInteractEvent(this, null, target, packet.face, PlayerInteractEvent.LEFT_CLICK_BLOCK);
            // this.server.getPluginManager().callEvent(ev);

            case PlayerActionPacket.ACTION_ABORT_BREAK:
            case PlayerActionPacket.ACTION_STOP_BREAK:
                //todo: broadcast level event
                break;

            case PlayerActionPacket.ACTION_CONTINUE_BREAK:
                break;

            case PlayerActionPacket.ACTION_START_SLEEPING:
                //unused
                break;
            case  PlayerActionPacket.ACTION_STOP_SLEEPING:
                // this.stopSleep();
                break;
            case PlayerActionPacket.ACTION_RESPAWN:
                // todo if ()
                //this.respawn()
                break;
            case PlayerActionPacket.ACTION_JUMP:
                this.jump();
                break;
            case  PlayerActionPacket.ACTION_START_SPRINT:

                console.log("PlayerActionHandler sprint toggled");
                //todo this.toggleSprint(true);
                break;
            case PlayerActionPacket.ACTION_STOP_SPRINT:
                //todo this.toggleSprint(false);
                break;
            case PlayerActionPacket.ACTION_START_SNEAK:
                //todo this.toggleSneak(true)
                break;
            case PlayerActionPacket.ACTION_STOP_SNEAK:
                //todo this.toggleSneak(false)
                break;
            case PlayerActionPacket.ACTION_START_GLIDE:
            case PlayerActionPacket.ACTION_STOP_GLIDE:
                break; //TODO
            case PlayerActionPacket.ACTION_START_SWIMMING:
                break; //TODO
            case PlayerActionPacket.ACTION_STOP_SWIMMING:
                break;
            case PlayerActionPacket.ACTION_INTERACT_BLOCK: //ignored (for now)
                break;
            default:
                console.log("Unhandled/unknown player action type " + packet.action + " from " + this.getName());
                return false;
        }

        //todo setUsingItem(false);
    }

    jump() {
        // this.server.getPluginManager(new PlayerJumpEvent(this));
        super.jump();
    }

    handleInteract(packet) {

        if (!this.spawned || !this.isAlive()) {

        }

        if (packet.action === InteractPacket.ACTION_MOUSEOVER && packet.target === 0) {
            return true;
        }

        //todo this.doCloseInventory();
        //todo finish

        switch (packet.action) {
            case InteractPacket.ACTION_LEAVE_VEHICLE:
            case InteractPacket.ACTION_MOUSEOVER:
                break; //TODO: handle these
            default:
                console.log("Unhandled/unknown interaction type " + packet.action + " from " + this.player.getName());
                return false;
        }
    }

    getWindow(windowId) {
        return this._windowIndex[windowId] || null;
    }

    handleMobEquipment(packet) {
        if (!this.spawned) {
            return true;
        }

        // let item
    }

    /*getOffsetPosition(pos){
        
        //let result = this.getOffsetPosition(Vector3);
    }*/

    /**
     *
     * @param title {string}
     * @param type {number}
     */
    sendTitleText(title, type) {
        let pk = new SetTitlePacket();
        pk.type = type;
        pk.text = title;
        this.dataPacket(pk);
    }

    sendMessage(message) {
        let pk = new TextPacket();
        pk.type = TextPacket.TYPE_RAW;
        pk.message = message;
        this.dataPacket(pk);
    }

    sendChunk(chunk) {
        let pk = new LevelChunkPacket();
        pk.chunkX = chunk.getX();
        pk.chunkZ = chunk.getZ();
        pk.subChunkCount = chunk.getSubChunkSendCount();
        pk.cacheEnabled = false;
        pk.extraPayload = chunk.toBinary();
        this.dataPacket(pk);

        if (this.spawned === false) {
            // this.player.sendPlayStatus(PlayStatusPacket.PLAYER_SPAWN);
            // this.spawned = true;
            this.doFirstSpawn();
            console.log("Chunk");
        }
    }

    /**
     * @return {PlayerSessionAdapter}
     */
    getSessionAdapter() {
        return this._sessionAdapter;
    }
}

module.exports = Player;
