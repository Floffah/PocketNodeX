/*
    (c) Floffah
    https://github.com/Floffah
    Floffah#6791
 */

class NodePlugin {
  constructor(server) {
    this._plma = server.getPluginManager();
  }

  /**
   * Get the plugin manager. (You can get the server from this)
   * @returns {PluginManager}
   */
  getPluginManager() {
    return this._plma;
  }

  //overridable classes
  /**
   * Ran when the plugin is enabled. Please init vars and your plugin here and **not** in constructor.
   */
  enable() {}

  /**
   * Ran when the plugin is disabled.
   */
  disable() {}

  /**
   * Ran when the plugin is loaded. This will always be ran before enable but most likely hasn't been initialised or had its dependencies checked/updated.
   */
  load() {}

  /**
   * Ran when the plugin is being unloaded. This will always be ran after disable.
   */
  unload() {}
}

module.exports = NodePlugin;
