const Command = require("./Command");
const CommandSender = require("./CommandSender");
const InvalidParameterError = require("../error/InvalidParameterError");

const Player = require("../player/Player");
const ConsoleCommandSender = require("./ConsoleCommandSender");

class CommandMap {

    constructor(Server) {
        this.initVars();
        this.server = Server;
    }

    initVars() {
        this.server = null;
        this.commands = new Map();
        this.aliases = new Map();
    }

    commandExists(commandName) {
        return this.commands.has(commandName);
    }

    aliasExists(alias) {
        return this.aliases.has(alias);
    }

    registerCommand(command) {
        if (command instanceof Command) {
            if (!this.commandExists(command.getName())) {
                this.commands.set(command.getName(), command);
                command.getAliases().forEach(alias => {
                    this.registerAlias(alias, command);
                });
                return true;
            }
            return false;
        } else {
            throw new InvalidParameterError("The command: " + command + " is not an instance of Command!");
        }
    }

    registerAlias(alias, command) {
        if (command instanceof Command) {
            if (!this.aliasExists(alias)) {
                this.aliases.set(alias, command);
                return true;
            } else {
                return false;
            }
        } else {
            throw new InvalidParameterError("The command: " + command + " is not an instance of Command!");
        }
    }

    unregisterCommand(commandName) {
        if (this.commandExists(commandName)) {
            let command = this.getCommand(commandName);
            command.getAliases().forEach(alias => {
                this.unregisterAlias(alias);
            });
            this.commands.delete(commandName);
            return true;
        }
        return false;
    }

    unregisterAlias(alias) {
        if (this.aliasExists(alias)) {
            this.aliases.delete(alias);
        }
    }

    getCommands() {
        return Array.from(this.commands.values());
    }

    getAliases() {
        return Array.from(this.aliases.values());
    }

    getCommand(commandName) {
        let command = this.getCommandByName(commandName);
        if (command !== null) {
            return command;
        }
        command = this.getCommandByAlias(commandName);
        if (command !== null) {
            return command;
        }

        return null;
    }

    getCommandByName(commandName) {
        if (this.commandExists(commandName)) {
            return this.commands.get(commandName);
        }

        return null;
    }

    getCommandByAlias(commandName) {
        let command = null;

        for (let [alias, cmd] in this.aliases) {
            if (alias === commandName) {
                command = cmd;
                break;
            }
        }

        return command;
    }

    dispatchCommand(sender, commandLine) {
        if (commandLine === "") return;
        let commandParts = commandLine.split(" ");
        let cmd = commandParts.shift();
        let args = commandParts;

        if (this.commands.has(cmd)) {
            let command = this.commands.get(cmd);
            if (command.getArguments().filter(arg => arg.isRequired()).length > 0) {
                if (args.length > 0) {
                    if (sender instanceof CommandSender || sender instanceof Player || sender instanceof ConsoleCommandSender) {
                        command.execute(sender, args);
                    } else {
                        throw new InvalidParameterError("Sender was not of type CommandSender/Player/ConsoleCommandSender.");
                    }
                } else {
                    sender.sendMessage(command.getUsage());
                }
            } else {
                if (sender instanceof CommandSender || sender instanceof Player || sender instanceof ConsoleCommandSender) {
                    command.execute(sender, args);
                } else {
                    throw new InvalidParameterError("Sender was not of type CommandSender/Player/ConsoleCommandSender.");
                }
            }
        } else if (this.aliases.has(cmd)) {
            let command = this.aliases.get(cmd);
            if (command.getArguments().filter(arg => arg.isRequired()).length > 0) {
                if (args.length > 0) {
                    if (sender instanceof CommandSender || sender instanceof Player || sender instanceof ConsoleCommandSender) {
                        command.execute({sender: sender, args: args});
                    } else {
                        throw new InvalidParameterError("Sender was not of type CommandSender/Player/ConsoleCommandSender.");
                    }
                } else {
                    sender.sendMessage(command.getUsage());
                }
            } else {
                if (sender instanceof CommandSender || sender instanceof Player || sender instanceof ConsoleCommandSender) {
                    command.execute({sender: sender, args: args});
                } else {
                    throw new InvalidParameterError("Sender was not of type CommandSender/Player/ConsoleCommandSender.");
                }
            }
        } else {
            sender.sendMessage("§4Command Not Found. Try /help for a list of commands.");
        }
    }
}

module.exports = CommandMap;
