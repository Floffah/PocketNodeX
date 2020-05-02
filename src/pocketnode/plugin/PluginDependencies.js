/*
    (c) Floffah
    https://github.com/Floffah
    Floffah#6791
 */
const Loadware = require('./PluginLoadware');

class Dependencies extends Loadware {
  constructor(server) {
    super(server);
  }

  load(rootpath, name) {
    console.log('hi from plugin deps');
  }
}

module.exports = Dependencies;
