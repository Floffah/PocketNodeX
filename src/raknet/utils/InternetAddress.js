function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class InternetAddress {
  /** @type {string} */

  /** @type {number} */

  /** @type {number} */

  /**
   * @param address {string}
   * @param port {number}
   * @param version {number}
   */
  constructor(address, port, version) {
    _defineProperty(this, "ip", void 0);

    _defineProperty(this, "port", void 0);

    _defineProperty(this, "version", void 0);

    this.ip = address;

    if (port < 0 || port > 65535) {
      throw new Error('Invalid port range');
    }

    this.port = port;
    this.version = version;
  }
  /**
   * @return {string}
   */


  getIp() {
    return this.ip;
  }
  /**
   * @return {number}
   */


  getPort() {
    return this.port;
  }
  /**
   * @return {number}
   */


  getVersion() {
    return this.version;
  }

}

module.exports = InternetAddress;