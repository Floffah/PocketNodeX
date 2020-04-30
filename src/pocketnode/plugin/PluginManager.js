/*
    (c) Floffah
    https://github.com/Floffah
    Floffah#6791
 */
let NodePlugin = require('./NodePlugin'),
    Collection = require('@discordjs/collection'),
    EmptyPlugin = require('./EmptyPlugin'),
    Path = require('path'),
    fs = require('fs');

class PluginManager {
  constructor(server) {
    this._server = server; //Contains [Boolean, NodePlugin] - the boolean being whether it's disabled or not.

    this.registry = new Map(); //Does not contain that

    this.loadware = new Map();
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
    this.loadware.add(loadware);
  }

  /**
   * Load a plugin.
   * @param {String} rootpath
   */
  loadPlugin(rootpath) {
    let files = {
      packagefl: Path.resolve(rootpath, 'package.json'),
      mainclass: Path.resolve(rootpath, require(files.packagefl).main),
      deps: Path.resolve(rootpath, 'node_modules')
    };

    let required = require(files.mainclass);

    try {
      new required();
    } catch (err) {
      this._server.getLogger().error(`Plugin "${require(files.packagefl).name}" does not export a class. Will not enable.`);
    }

    let Plugin;
  }

  disablePlugins() {}

  /**
   * Get the server.
   * @returns {Server}
   */
  getServer() {
    return this._server;
  }
}

module.exports = PluginManager;
