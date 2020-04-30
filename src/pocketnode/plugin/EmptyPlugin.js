let NodePlugin = require('./NodePlugin');

class EmptyPlugin extends NodePlugin {
  constructor(server) {
    super(server);
  }

  enable() {}

  disable() {}

  load() {}

  unload() {}

}

module.exports = EmptyPlugin;