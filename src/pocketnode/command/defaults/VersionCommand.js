const Command = require("../Command");

class VersionCommand extends Command {

    constructor() {
        super("version", "Show server version...", "pocketnode.command.version", ["ver"]);
    }

    execute(sender, args) {
        super.execute(sender, args);
        sender.sendMessage("This server is running PocketNode " + sender.getServer().getPocketNodeVersion() + " for MinecraftPE " + sender.getServer().getVersion());
    }
}

module.exports = VersionCommand;