function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//TODO: new software name can be Jukebox?
const ProtocolInfo = require("./network/mcpe/Info");

const Config = require("./utils/Config");

const UUID = require('./utils/UUID');

const SkinAdapterSingleton = require('./network/mcpe/protocol/types/SkinAdapterSingleton');
/* Old plugin stuff
const PluginManager = require("./oldplugin/PluginManager");
const SourcePluginLoader = require("./oldplugin/SourcePluginLoader");
const ScriptPluginLoader = require("./oldplugin/ScriptPluginLoader");*/
//V replaced by new V


const PluginManager = require("./plugin/PluginManager");

const PluginDependencies = require('./plugin/PluginDependencies');

const Isset = require("./utils/methods/Isset");

const PlayerListPacket = require('./network/mcpe/protocol/PlayerListPacket');

const PlayerListEntry = require('./network/mcpe/protocol/types/PlayerListEntry');

const RakNetAdapter = require("./network/RakNetAdapter");

const BatchPacket = require("./network/mcpe/protocol/BatchPacket");

const RuntimeBlockMapping = require("./network/mcpe/protocol/types/RuntimeBlockMapping");

const CommandMap = require("./command/CommandMap");

const ConsoleCommandReader = require("./command/ConsoleCommandReader");

const HelpCommand = require("./command/defaults/HelpCommand");

const StopCommand = require("./command/defaults/StopCommand");

const VersionCommand = require("./command/defaults/VersionCommand");

const PluginsCommand = require("./command/defaults/PluginsCommand");

const TitleCommand = require("./command/defaults/TitleCommand");

const Player = require("./player/Player");

const PlayerList = require("./player/PlayerList");

const Entity = require("./entity/Entity");

const localizationManager = require("./localization/localizationManager");

const ResourcePackManager = require("./resourcepacks/ResourcePackManager");

const Level = require("./level/Level");

const GeneratorManager = require("./level/generator/GeneratorManager");

const FlatGenerator = require("./level/generator/FlatGenerator");

const EventHandler = require("./event/EventHandler");

const TestEvent = require("./event/TestEvent");

const SFS = require("./utils/SimpleFileSystem");

class Server {
  /** @type {Server | null} */
  constructor(pocketnode, localizationManager, logger, paths) {
    this.initVars();

    if (Server._instance) {
      throw Error('Server is a singleton. Please use `getInstance` method instead');
    }

    this._pocketnode = pocketnode;
    this.localizationManager = localizationManager;
    this._logger = logger;
    this._paths = paths;

    if (!SFS.dirExists(this.getDataPath() + "worlds/")) {
      SFS.mkdir(this.getDataPath() + "worlds/");
    }

    if (!SFS.dirExists(this.getDataPath() + "players/")) {
      SFS.mkdir(this.getDataPath() + "players/");
    }

    if (!SFS.dirExists(this._paths.plugins)) {
      SFS.mkdir(this._paths.plugins);
    }

    this.getLogger().info(localizationManager.getPhrase("language"));
    this.getLogger().info(localizationManager.getPhrase("starting-pocketnode").replace("{{name}}", this.getName()).replace("{{version}}", this.getVersion()));
    this.getLogger().info(localizationManager.getPhrase("loading-properties"));

    if (!SFS.fileExists(this._paths.data + "pocketnode.json")) {
      SFS.copy(this._paths.file + "pocketnode/resources/pocketnode.json", this._paths.data + "pocketnode.json");
    }

    this._config = new Config(this.getDataPath() + "pocketnode.json", Config.JSON, {});
    this._debuggingLevel = this._config.getNested("debugging.level", 0);
    this.getLogger().setDebugging(this._debuggingLevel); //this._scheduler

    this._ops = new Config(this.getDataPath() + "ops.json", Config.JSON);
    this._whitelist = new Config(this.getDataPath() + "whitelist.json", Config.JSON);
    this._bannedNames = new Config(this.getDataPath() + "banned-names.json", Config.JSON);
    this._bannedIps = new Config(this.getDataPath() + "banned-ips.json", Config.JSON);
    this._maxPlayers = this._config.getNested("server.max-players", 20);
    this._onlineMode = this._config.getNested("server.online-mode", true);
    if (!TRAVIS_BUILD) process.stdout.write("\x1b]0;" + this.getName() + " " + this.getPocketNodeVersion() + "\x07");
    this.getLogger().debug("Server Id:", this._serverID);
    this.getLogger().info(localizationManager.getPhrase("starting-server").replace("{{ip}}", this.getIp()).replace("{{port}}", this.getPort()));
    this._raknetAdapter = new RakNetAdapter(this);
    this.getLogger().info("This server is running " + this.getName() + " version " + this.getPocketNodeVersion() + " \"" + this.getCodeName() + "\" (API " + this.getApiVersion() + ")");
    this.getLogger().info(localizationManager.getPhrase("license"));
    this.getLogger().info(localizationManager.getPhrase("done").replace("{{time}}", Date.now() - this._pocketnode.START_TIME));
    this._commandMap = new CommandMap(this);
    this.registerDefaultCommands();
    this._consoleCommandReader = new ConsoleCommandReader(this);
    this._resourcePackManager = new ResourcePackManager(this, this.getDataPath() + "resource_packs/");
    /*this._pluginManager = new PluginManager(this);
    this._pluginManager.registerLoader(SourcePluginLoader);
    this._pluginManager.registerLoader(ScriptPluginLoader);
    this._pluginManager.loadPlugins(this.getPluginPath());
    this._pluginManager.enablePlugins(); //load order STARTUP*/

    this.getLogger().info("Loading plugins...");
    this._pluginManager = new PluginManager(this);

    this._pluginManager.addLoadware(PluginDependencies);

    this._pluginManager.loadAndEnable();

    this._generatorManager = new GeneratorManager();

    this._generatorManager.addGenerator("flat", FlatGenerator);

    if (this.getDefaultLevel() === null) {
      this._defaultLevel = new Level(this);
    }

    Entity.init(); //enable plugins POSTWORLD

    this.start();
  }

  static getGamemodeName(mode) {
    switch (mode) {
      case Player.SURVIVAL:
        return "Survival";

      case Player.CREATIVE:
        return "Creative";

      case Player.ADVENTURE:
        return "Adventure";

      case Player.SPECTATOR:
        return "Spectator";

      default:
        return "Unknown";
    }
  }

  initVars() {
    this._instance = null;
    this._sleeper = null;
    this._tickSleeper = null;
    this._banByName = null;
    this._banByIP = null;
    this._operators = null;
    this._whitelist = {};
    this._isRunning = true;
    this._hasStopped = false;
    this._pluginManager = {};
    this._profilingTickRate = 20;
    this._updater = null;
    this._asyncPool = null;
    this._tickCounter = 0;
    this._nextTick = 0;
    this._tickAverage = new Array(20).fill(20);
    this._useAverage = new Array(20).fill(0);
    this._currentTPS = 20;
    this._currentUse = 0;
    this._doTitleTick = true;
    this._sendUsageTicker = 0;
    this._dispatchSignals = false;
    this._logger = {};
    this._memoryManager = {};
    this._console = null;
    this._commandMap = null;
    this._craftingManager = null;
    this._resourceManager = null;
    this._maxPlayers = -1;
    this._onlineMode = true;
    this._autoSave = false;
    this._rcon = null;
    this._entityMetadata = null;
    this._playerMetadata = null;
    this._levelMetadata = null;
    this._network = null;
    this._networkCompressionAsync = true;
    this._networkCompressionLevel = 7;
    this._autoSaveTicker = 0;
    this._autoSaveTicks = 6000;
    this._baseLang = null;
    this._forceLanguage = false;
    this._serverID = Math.floor(Math.random() * 99999999 + 1);
    this._queryRegenerateTask = null;
    this._properties = null;
    this._propertyCache = [];
    this._pocketnode = {};
    this._bannedIps = {};
    this._bannedNames = {};
    this._scheduler = {}; //todo

    this._debuggingLevel = 0;
    this._consoleCommandReader = {};
    this._commandMap = {};
    this._resourcePackManager = {};
    this._raknetAdapter = {};
    this._paths = {};
    this._config = {};
    this._players = new PlayerList();
    this._loggedInPlayers = new PlayerList();
    this._playerList = [];
    this._eventSystem = new EventHandler(this);
    /** @type {Map<String, Level>} */

    this._levels = new Map();
    this._defaultLevel = null;
    this._entityCount = 0;
    this._localizationManager = null;
  }

  start() {
    //block banned ips
    this._tickCounter = 0;
    this.getLogger().info("Done (" + (Date.now() - this._pocketnode.START_TIME) + "ms)!");
    this.tickProcessor();
    RuntimeBlockMapping.init(); //this.forceShutdown();
  } //By twsited & jackx, this hack is nice.


  registerDefaultCommands() {
    let dir = __dirname + '/command/defaults';
    const commands = SFS.readDir(dir);
    commands.forEach(defaultCommand => {
      defaultCommand = require(dir + '/' + defaultCommand);
      this.getCommandMap().registerCommand(new defaultCommand());
    });
  }
  /**
   * @return {boolean}
   */


  isRunning() {
    return this._isRunning;
  }

  shutdown() {
    if (!this._isRunning) return;
    this.getLogger().info("Shutting down...");

    this._raknetAdapter.shutdown();

    this._pluginManager.disablePlugins();

    this._isRunning = false;
    process.exit(); // fix this later
  }
  /**
   * @return {string}
   */


  getName() {
    return this._pocketnode.NAME;
  }
  /**
   * @return {string}
   */


  getCodeName() {
    return this._pocketnode.CODENAME;
  }
  /**
   * @return {string}
   */


  getPocketNodeVersion() {
    return this._pocketnode.VERSION;
  }
  /**
   * @return {string}
   */


  getVersion() {
    return ProtocolInfo.VERSION;
  }
  /**
   * @return {number}
   */


  getProtocol() {
    return ProtocolInfo.PROTOCOL;
  }
  /**
   * @return {string}
   */


  getApiVersion() {
    return this._pocketnode.API_VERSION;
  }
  /**
   * @return {CommandMap}
   */


  getCommandMap() {
    return this._commandMap;
  }

  getPluginManager() {
    return this._pluginManager;
  }
  /**
   * @return {string}
   */


  getDataPath() {
    return this._paths.data;
  }

  getFilePath() {
    return this._paths.file;
  }

  getPluginPath() {
    return this._paths.plugins;
  }
  /**
   * @return {number}
   */


  getMaxPlayers() {
    return this._maxPlayers;
  }
  /**
   * Returns whether the server requires players to be authenticated to Xbox Live.
   *
   * @return {boolean}
   */


  getOnlineMode() {
    return this._onlineMode;
  }
  /**
   * Alias of this.getOnlineMode()
   *
   * @return {boolean}
   */


  requiresAuthentication() {
    return this.getOnlineMode();
  }
  /**
   * @return {string}
   */


  getIp() {
    return this._config.getNested("server.ip", "0.0.0.0");
  }
  /**
   * @return {number}
   */


  getPort() {
    return this._config.getNested("server.port", 19132);
  }
  /**
   * @return {number}
   */


  getServerId() {
    return this._serverID;
  }

  getGamemode() {
    return this._config.getNested("server.gamemode", 1);
  }
  /**
   * @return {boolean}
   */


  hasWhitelist() {
    return this._config.getNested("server.whitelist", false);
  }
  /**
   * @return {string}
   */


  getMotd() {
    return this._config.getNested("server.motd", this._pocketnode.NAME + " Server");
  }
  /**
   * @return {Logger}
   */


  getLogger() {
    return this._logger;
  }
  /**
   * @return {Array}
   */


  getOnlinePlayers() {
    return Array.from(this._playerList.values());
  }
  /**
   * @return {Array}
   */


  getLoggedInPlayers() {
    return Array.from(this._loggedInPlayers.values());
  }
  /**
   * @return {number}
   */


  getOnlinePlayerCount() {
    return this.getOnlinePlayers().length;
  }
  /**
   * @return {boolean}
   */


  isFull() {
    return this.getOnlinePlayerCount() === this.getMaxPlayers();
  }
  /**
   * @return {ResourcePackManager}
   */


  getResourcePackManager() {
    return this._resourcePackManager;
  }

  broadcastMessage(message, recipients = this.getOnlinePlayers()) {
    recipients.forEach(recipient => recipient.sendMessage(message));
    return recipients.length;
  }
  /**
   * @param name {string}
   * @return {Player}
   */


  getPlayer(name) {
    name = name.toLowerCase();
    let found = null;
    let delta = 20; // estimate nametag length

    for (let [username, player] of this._playerList) {
      if (username.indexOf(name) === 0) {
        let curDelta = username.length - name.length;

        if (curDelta < delta) {
          found = player;
          delta = curDelta;
        }

        if (curDelta === 0) {
          break;
        }
      }
    }

    return found;
  }
  /**
   * @param name {string}
   * @return {Player}
   */


  getPlayerExact(name) {
    name = name.toLowerCase();

    if (this._playerList.has(name)) {
      return this._playerList.get(name);
    }

    return null;
  }
  /**
   * @param partialName {string}
   * @return []{Player}
   */


  matchPlayer(partialName) {
    partialName = partialName.toLowerCase();
    let matchedPlayers = [];

    for (let [username, player] of this._playerList) {
      if (username === partialName) {
        matchedPlayers = [player];
        break;
      } else if (username.indexOf(partialName) === 0) {
        matchedPlayers.push(player);
      }
    }

    return matchedPlayers;
  } // TODO: do with functions

  /** @param player {Player} */


  sendFullPlayerListData(player) {
    let pk = new PlayerListPacket();
    pk.type = PlayerListPacket.TYPE_ADD;

    this._playerList.forEach(player => {
      pk.entries.push(PlayerListEntry.createAdditionEntry(player._uuid, player.id, player._username, SkinAdapterSingleton.get().toSkinData(player._skin), player._xuid));
    });

    player.dataPacket(pk);
  }

  addPlayer(id, player) {
    CheckTypes([Player, player]);

    this._players.addPlayer(id, player);
  }

  addOnlinePlayer(player) {
    CheckTypes([Player, player]);

    this._playerList.push(player); // this._playerList.addPlayer(player.getLowerCaseName(), player);

  }

  removeOnlinePlayer(player) {
    CheckTypes([Player, player]); // this._playerList.removePlayer(player.getLowerCaseName()); // todo
  }

  removePlayer(player) {
    CheckTypes([Player, player]);

    if (this._players.hasPlayer(player)) {
      this._players.removePlayer(this._players.getPlayerIdentifier(player));
    }
  }
  /**
   * @return {PlayerList}
   */


  getPlayerList() {
    return this._players;
  }
  /**
   * @return {PlayerList}
   */


  getOnlinePlayerList() {
    return this._playerList;
  }
  /**
   * @return {Level|null}
   */


  getDefaultLevel() {
    return this._defaultLevel;
  }
  /**
   * @return {String}
   */


  getLevelType() {
    return this._config.getNested("level.type", "flat");
  }
  /**
   * @return {Config}
   */


  getNameBans() {
    return this._bannedNames;
  }
  /**
   * @return {Config}
   */


  getIpBans() {
    return this._bannedIps;
  }

  tickProcessor() {
    let int = createInterval(() => {
      if (this.isRunning()) {
        this.tick();
      } else {
        //this.forceShutdown();
        int.stop();
      }
    }, 1000 / 20);
    int.run();
  }
  /**
   * @return {GeneratorManager}
   */


  getGeneratorManager() {
    return this._generatorManager;
  }

  getRakNetAdapter() {
    return this._raknetAdapter;
  }

  tick() {
    let time = Date.now();
    let tickTime = Date.now() % 1000 / 1000;
    ++this._tickCounter;

    if (this._tickCounter % 20 === 0) {
      this.titleTick();
      this._currentTPS = 20;
      this._currentUse = 0;
    }

    this.checkTickUpdates(this._tickCounter, tickTime);
    let now = Date.now();
    this._currentTPS = Math.min(20, 1000 / Math.max(1, now - time));
    this._currentUse = Math.min(1, (now - time) / 50);

    this._tickAverage.shift();

    this._tickAverage.push(this._currentTPS);

    this._useAverage.shift();

    this._useAverage.push(this._currentUse);

    this._raknetAdapter.tick();
  }

  getTick() {
    return this._tickCounter;
  }

  checkTickUpdates(currentTick, tickTime) {
    this.getOnlinePlayers().forEach(player => {
      if (!player.loggedIn && tickTime - player.creationTime >= 10) {
        player.close("", "Login timeout");
      }
    });
    this.getOnlinePlayers().forEach(player => {
      player.onUpdate(currentTick);
    });

    this._defaultLevel.actuallyDoTick(currentTick); //Do level ticks

    /*this._levels.forEach(k => level => {
        if (!Isset(this._levels[k])){
            // Level unloaded during the tick of a level earlier in this loop, perhaps by plugin
            // continue;
        }
          let levelTime = (Date.now() % 1000) / 1000;
        level.doTick(currentTick);
        let ticksMs = (Date.now() % 1000) / 1000 - levelTime;
        level.tickRateTime = ticksMs;
        if (ticksMs >= 50){
            //console.log(`World \"%s\" took too long to tick: %gms (%g ticks)", ${level.getName()}, ${tickMs}, round($tickMs / 50, 2`);
            console.log(`World \"%s\" took too long to tick THIS LOG IS NOT COMPLETE YET.`);
        }
    });*/
    //refactored here

    /*this._levels.forEach(k => {
        for(let level of k){
            if (!Isset(this._levels[k])){
                // Level unloaded during the tick of a level earlier in this loop, perhaps by plugin
            }
              let levelTime = (Date.now() % 1000) / 1000;
            level.doTick(currentTick);
            let ticksMs = (Date.now() % 1000) / 1000 - levelTime;
            level.tickRateTime = ticksMs;
            if (ticksMs >= 50){
                //console.log(`World \"%s\" took too long to tick: %gms (%g ticks)", ${level.getName()}, ${tickMs}, round($tickMs / 50, 2`);
                console.log(`World \"%s\" took too long to tick THIS LOG IS NOT COMPLETE YET.`);
            }
        }
    });*/

  }

  getTicksPerSecond() {
    return Math.round_php(this._currentTPS, 2);
  }

  getEventSystem() {
    return this._eventSystem;
  }

  getTicksPerSecondAverage() {
    return Math.round_php(this._tickAverage.reduce((a, b) => a + b, 0) / this._tickAverage.length, 2);
  }

  getTickUsage() {
    return Math.round_php(this._currentUse * 100, 2);
  }

  getTickUsageAverage() {
    return Math.round_php(this._useAverage.reduce((a, b) => a + b, 0) / this._useAverage.length * 100, 2);
  }

  getCurrentTick() {
    return this._currentTPS;
  }

  titleTick() {
    process.stdout.write("\x1b]0;" + this.getName() + " " + this.getPocketNodeVersion() + " | " + "Online " + this.getOnlinePlayerCount() + "/" + this.getMaxPlayers() + " | " + "TPS " + this.getTicksPerSecondAverage() + " | " + "Load " + this.getTickUsageAverage() + "%" + "\x07");
  }

  batchPackets(players, packets, forceSync = false, immediate = false) {
    let targets = [];
    players.forEach(player => {
      if (player.isConnected()) targets.push(this._players.getPlayerIdentifier(player));
    });

    if (targets.length > 0) {
      let pk = new BatchPacket();
      packets.forEach(packet => pk.addPacket(packet));

      if (!forceSync && !immediate) {//todo compress batched packets async
      } else {
        this.broadcastPackets(pk, targets, immediate);
      }
    }
  }

  broadcastPackets(pk, identifiers, immediate) {
    if (!pk.isEncoded) {
      pk.encode();
    }

    if (immediate) {
      identifiers.forEach(id => {
        if (this._players.has(id)) {
          this._players.getPlayer(id).directDataPacket(pk);
        }
      });
    } else {
      identifiers.forEach(id => {
        if (this._players.has(id)) {
          this._players.getPlayer(id).dataPacket(pk);
        }
      });
    }
  }

  onPlayerLogin(player) {
    this._loggedInPlayers.addPlayer(player.getLowerCaseName(), player); //todo unique ids

  }

  onPlayerLogout(player) {
    this._loggedInPlayers.removePlayer(player.getLowerCaseName()); //todo unique id

  }

  onPlayerCompleteLoginSequence(player) {}
  /** @return {Server} */


  static getInstance() {
    return Server._instance;
  }

}

_defineProperty(Server, "_instance", null);

module.exports = Server;