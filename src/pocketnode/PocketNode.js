const Path = require("path");

require("./utils/methods/Globals");

const Logger = require("./logger/Logger");
const Server = require("./Server");
const localizationManager = require("./localization/localizationManager");
const Config = require("./utils/Config");

function PocketNode(paths) {
    this.START_TIME = Date.now();
    this.NAME = "PocketNodeX";
    this.CODENAME = "[ALPHA]";
    this.VERSION = "0.0.1";
    this.API_VERSION = "1.0.0";

    let logger = new Logger("Server");
    let path = {
        file: Path.normalize(__dirname + "/../"),
        data: Path.normalize(__dirname + "/../../"),
        plugins: Path.normalize(__dirname + "/../../plugins/")
    };

    for (let i in paths) {
        if (paths.hasOwnProperty(i)) {
            if (typeof path[i] !== "undefined") {
                path[i] = paths[i];
            }
        }
    }

    let config = new Config(path.data + "pocketnode.json", Config.JSON, {});
    this.localizationManager = new localizationManager(config.getNested("server.language", "en"));
    this.localizationManager.loadLanguages();

    logger.info(this.localizationManager.getPhrase("loading"));

    let server = new Server(this, this.localizationManager, logger, path);
    Server._instance = server;

    if (TRAVIS_BUILD === true) {
        server.shutdown();
    }

    return server;
}

module.exports = PocketNode;
