const Command = require("../Command");

class TitleCommand extends Command {
    constructor() {
        super("title", "Send a title to a player.", "pocketnode.command.title", []);
    }

    execute(sender, args) {
        super.execute(sender, args);
        if (args < 2) {
            sender.sendMessage("Usage: /title <player> <message>");
            return;
        }
        let player = sender.getServer().getPlayer(args[0]);
        args.shift();
        if (player === null) {
            sender.sendMessage("Player not found");
            return
        }
        player.addTitle("test", "", 20, 1, 1);
    }
}

module.exports = TitleCommand;