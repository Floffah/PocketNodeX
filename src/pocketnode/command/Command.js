const TextFormat = require("../utils/TextFormat");
const CommandSender = require("./CommandSender");
const ConsoleCommandSender = require("./ConsoleCommandSender");
const InvalidParameterError = require("../error/InvalidParameterError");


class Command {
    /**
     * @param name        {string}
     * @param description {string}
     * @param permission  {string}
     * @param aliases     {array}
     */
    constructor(name, description, permission, aliases = []) {
        this.initVars();
        this.name = name;
        this.description = description;
        this.permission = permission;
        this.aliases = aliases;
    }

    initVars() {
        this.name = "";
        this.description = "";
        this.permission = "";
        this.usage = "";
        this.aliases = [];
        this.arguments = [];
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    getUsage() {
        let usage = TextFormat.RED + "Usage: /" + this.getName() + " ";

        this.getArguments().forEach(argument => {
            if (argument.isRequired()) {
                usage += "<";
            } else {
                usage += "[";
            }

            usage += argument.getName() + ": " + argument.getType();

            if (argument.isRequired()) {
                usage += ">";
            } else {
                usage += "]";
            }

            usage += " ";
        });


        return usage;
    }

    getPermission() {
        return this.permission;
    }

    getAliases() {
        return this.aliases;
    }

    // testPermission

    addArgument(name, type, isRequired) {
        this.arguments.push({
            name: name,
            type: type,
            required: isRequired,
            getName: function () {
                return this.name;
            },
            getType: function () {
                return this.type;
            },
            isRequired: function () {
                return this.required;
            }
        });
    }

    getArguments() {
        return this.arguments;
    }

    execute(sender, args) {
        if (!sender instanceof CommandSender && !sender instanceof ConsoleCommandSender) {
            throw new InvalidParameterError("Command sender not of type CommandSender.");
        }
    }
}

module.exports = Command;