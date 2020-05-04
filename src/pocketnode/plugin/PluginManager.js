/*
    (c) Floffah
    https://github.com/Floffah
    Floffah#6791
 */
let NodePlugin = require('./NodePlugin'),
    EmptyPlugin = require('./EmptyPlugin'),
    Path = require('path'),
    fs = require('fs'),
    async = require('async');

class PluginManager {
    constructor(server) {
        this._server = server;
        this._vars();
    }

    _vars() {
        //Contains [Boolean, NodePlugin] - the boolean being whether it's disabled or not.
        this.registry = new Map();
        //Does not contain that
        this.loadware = []
    }

    /**
     * Get a plugin instance by name.
     * @param {String} name
     * @returns {EmptyPlugin|Plugin}
     */
    getPlugin(name) {
        let found = this.registry.get(name);

        if (found instanceof NodePlugin) {
            return found;
        } else {
            return new EmptyPlugin();
        }
    }

    /**
     * Adds a class with functions ran for every plugin that is loaded. Must be called before PluginManager.load()
     * @param {Loadware} loadware
     */
    addLoadware(loadware) {
        this.loadware.push(new loadware());
    }

    /**
     * Load a plugin.
     * @param {String} rootpath
     * @param {pluginLoadedCallback} done
     * @returns Promise<NodePlugin>
     */
    async loadPlugin(rootpath, done) {
        let files = {
            packagefl: Path.resolve(rootpath, 'package.json'),
            mainclass: Path.resolve(rootpath, require(Path.resolve(rootpath, 'package.json')).main ? require(Path.resolve(rootpath, 'package.json')).main : "Plugin.js"),
            deps: Path.resolve(rootpath, '../node_modules')
        };

        if(!fs.lstatSync(rootpath).isDirectory()) {
            if(done) done();
            return null;
        }

        if(require(files.packagefl).name === undefined) {
            this._server.getLogger().error(`Plugin "${require(files.packagefl).name}" does not have a name in it's package.json file. Will not load.`);
            if(done) done({plugin: require(files.packagefl).name, message: `Plugin "${require(files.packagefl).name}" does not have a name in it's package.json file. Will not load.`});
            return null;
        }

        /**
         * @type string
         */
        let name = require(files.packagefl).name;

        if(require(files.packagefl).plugin === undefined) {
            this._server.getLogger().error(`Plugin "${require(files.packagefl).name}" does not have a plugin entry in it's package.json file. Will not load.`);
            if(done) done({plugin: require(files.packagefl).name, message: `Plugin "${require(files.packagefl).name}" does not have a plugin entry in it's package.json file. Will not load.`})
            return null;
        }

        if(require(files.packagefl).plugin.name === undefined) {
            this._server.getLogger().debug(`Plugin "${require(files.packagefl).name}" does not have a name. Using package name.`);
        } else {
            name = require(files.packagefl).plugin.name
        }

        if(!fs.existsSync(files.mainclass)) {
            this._server.getLogger().error(`Could not find file "${files.mainclass}" in plugin "${require(files.packagefl).name}".`);
            if(done) done({plugin: require(files.packagefl).name, message: `Could not find file "${files.mainclass}" in plugin "${require(files.packagefl).name}".`})
            return null;
        }

        await async.forEach(this.loadware, (ldw, done) => {
            try {
                let loadware = new ldw(this.getServer());
                loadware.load(rootpath, name);
            } catch(e) {
                done();
            }
        }, (err) => {
            if(done) done({plugin: name, error: err, message: 'Could not create new instance of loadware.'});
        });

        let required = require(files.mainclass);

        try {
            new required();
        } catch (err) {
            this._server.getLogger().error(`Plugin "${require(files.packagefl).name}" does not export a class. Will not enable.`);
        }

        let Plugin;

        if(done) done();
    }

    loadAndEnableAll(pluginspath) {
        let unfound = fs.readdirSync(pluginspath);
        async.forEach(unfound, (pl, done) => {
            this.loadPlugin(Path.resolve(pluginspath, pl), done);
        }, (err) => {
            if(err) {
                this.getServer().getLogger().error("There was an error while loading plugin " + err.plugin + ". There is likely additional information above.");
            }
        });
    }

    disablePlugins() {
    }

    /**
     * Get the server.
     * @returns {Server}
     */
    getServer() {
        return this._server;
    }
}

module.exports = PluginManager;

/**
 * The callback ran when the plugin has finished loading
 * @callback pluginLoadedCallback
 * @param {NodePlugin|{error: String, message: String, name: String}} pluginInstance
 */
