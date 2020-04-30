class CommandSender {
    constructor(server) {
        this.server = server;
    }

    hasPermission() {
        return false;
    }

    getServer() {
        return this.server;
    }
}

module.exports = CommandSender;
