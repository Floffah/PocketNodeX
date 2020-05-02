/*
    (c) Floffah
    https://github.com/Floffah
    Floffah#6791
 */
class Loadware {
  constructor(server) {
    this._server = server;
  }

  /**
   * Ran just before a plugin is loaded.
   * @param {string} rootpath - the root path of the plugin.
   * @param {string} name - the name of the plugin.
   */
  load(rootpath, name) {}

  getServer() {
    return this._server;
  }
}

module.exports = Loadware;
