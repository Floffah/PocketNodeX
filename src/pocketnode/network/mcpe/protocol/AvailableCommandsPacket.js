const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

const CommandEnum = require("./types/CommandEnum");
const CommandData = require("./types/CommandData");
const CommandParameter = require("./types/CommandParameter");

class AvailableCommandsPacket extends DataPacket {
    static getId() {
        return ProtocolInfo.AVAILABLE_COMMANDS_PACKET;
    }

    /**
     * This flag is set on all types EXCEPT the POSTFIX type. Not completely sure what this is for, but it is required
     * for the arg type to work correctly. VALID seems as good a name as any.
     */
    static get ARG_FLAG_VALID() {
        return 0x100000
    };

    /**
     * Basic parameter types. These must be combined with the ARG_FLAG_VALID constant.
     * ARG_FLAG_VALID | (type const)
     */
    static get ARG_TYPE_INT() {
        return 0x01
    };

    static get ARG_TYPE_FLOAT() {
        return 0x02
    };

    static get ARG_TYPE_VALUE() {
        return 0x03
    };

    static get ARG_TYPE_WILDCARD_INT() {
        return 0x04
    };

    static get ARG_TYPE_OPERATOR() {
        return 0x05
    };

    static get ARG_TYPE_TARGET() {
        return 0x06
    };

    static get ARG_TYPE_FILEPATH() {
        return 0x0e
    };

    static get ARG_TYPE_STRING() {
        return 0x1b
    };

    static get ARG_TYPE_POSITION() {
        return 0x1d
    };

    static get ARG_TYPE_MESSAGE() {
        return 0x20
    };

    static get ARG_TYPE_RAWTEXT() {
        return 0x22
    };

    static get ARG_TYPE_JSON() {
        return 0x25
    };

    static get ARG_TYPE_COMMAND() {
        return 0x2c
    };

    /**
     * Enums are a little different: they are composed as follows:
     * ARG_FLAG_ENUM | ARG_FLAG_VALID | (enum index)
     */
    static get ARG_FLAG_ENUM() {
        return 0x200000
    };

    /**
     * This is used for /xp <level: int>L. It can only be applied to integer parameters.
     */
    static get ARG_FLAG_POSTFIX() {
        return 0x1000000
    };

    /**
     * @type {string[]}
     * A list of every single enum value for every single command in the packet, including alias names.
     */
    enumValues = [];
    /** @type {number} */
    enumValuesCount = 0;
    /**
     * @type {string[]}
     * A list of argument postfixes. Used for the /xp command's <int>L.
     */
    postfixes = [];
    /**
     * @type {CommandEnum[]}
     * List of command enums, from command aliases to argument enums.
     */
    enums = [];
    /**
     * @type {{}} string => int map of enum name to index
     */
    enumMap = {};
    /**
     * @type {CommandData[]}
     * List of command data, including name, description, alias indexes and parameters.
     */
    commandData = [];
    /**
     * @type {CommandEnum[]}
     * List of dynamic command enums, also referred to as "soft" enums. These can by dynamically updated mid-game
     * without resending this packet.
     */
    softEnums = [];

    _decodePayload() {
        this.enumValuesCount = this.readUnsignedVarInt();
        for (let i = 0; i < this.enumValuesCount; ++i) {
            this.enumValues.push(this.readString());
        }

        for (let i = 0, count = this.readUnsignedVarInt(); i < count; i++) {
            this.postfix.push(this.readString());
        }

        for (let i = 0, count = this.readUnsignedVarInt(); i < count; i++) {
            this.enums.push(this.getEnum());
        }

        for (let i = 0, count = this.readUnsignedVarInt(); i < count; i++) {
            this.commandData.push(this.getCommandData());
        }

        for (let i = 0, count = this.readUnsignedVarInt(); i < count; i++) {
            this.softEnums.push(this.getSoftEnum());
        }
    }

    /**
     * @return {CommandEnum}
     */
    getEnum() {
        let retval = new CommandEnum();
        retval.enumName = this.readString();

        for (let i = 0, count = this.readUnsignedVarInt(); i < count; ++i) {
            let index = this.getEnumValueIndex();
            if (!Isset(this.enumValues[index])) {
                console.log(`Invalid enum value index ${index}`);
            }
            //Get the enum value from the initial pile of mess
            retval.enumValues.push(this.enumValues[index]);
        }
        return retval;
    }

    /**
     *
     * @return {CommandEnum}
     */
    getSoftEnum() {
        let retval = new CommandEnum();
        retval.enumName = this.readString();

        for (let i = 0, count = this.readUnsignedVarInt(); i < count; ++i) {
            //Get the enum value from the initial pile of mess
            retval.enumValues.push(this.readString());
        }

        return retval;
    }

    putEnum(enumVal) {
        CheckTypes([CommandEnum, enumVal]);
        this.writeString(enumVal.enumName);

        this.writeUnsignedVarInt(enumVal.enumValues.length);
        enumVal.enumValues.forEach(value => {
            let index = this.enumValues.indexOf(value);
            if (index === -1) {
                throw new RangeError(`Enum value '${value}' not found`);
            }
            this.putEnumValueIndex(index);
        });
    }

    putSoftEnum(enumVal) {
        this.writeString(enumVal.enumName);

        this.writeUnsignedVarInt(enumVal.enumValues.length);
        enumVal.enumValues.forEach(value => {
            this.writeString(value);
        });
    }

    getEnumValueIndex() {
        if (this.enumValues.length < 256) {
            return this.readByte();
        } else if (this.enumValues.length < 65536) {
            return this.readLShort();
        } else {
            return this.readLInt();
        }
    }

    putEnumValueIndex(index) {
        if (this.enumValues.length < 256) {
            return this.writeByte(index);
        } else if (this.enumValues.length < 65536) {
            return this.writeLShort(index);
        } else {
            return this.writeLInt(index);
        }
    }

    getCommandData() {
        let retval = new CommandData();
        retval.name = this.readString();
        retval.description = this.readString();
        retval.flags = this.readByte();
        retval.permission = this.readByte();
        retval.aliases = this.enums[this.readLInt()] || null;

        for (let overloadIndex = 0, overloadCount = this.readUnsignedVarInt(); overloadIndex < overloadCount; ++overloadIndex) {
            retval.overloads[overloadIndex] = [];
            for (let paramIndex = 0, paramCount = this.readUnsignedVarInt(); paramIndex < paramCount; ++paramIndex) {
                let parameter = new CommandParameter();
                parameter.paramName = this.readString();
                parameter.paramType = this.readLInt();
                parameter.isOptional = this.readBool();
                parameter.byte1 = this.readByte();

                if (parameter.paramType & AvailableCommandsPacket.ARG_FLAG_ENUM) {
                    let index = (parameter.paramType & 0xffff);
                    parameter.enum = this.enums[index] || null;
                    if (parameter.enum === null) {
                        throw new RangeError(`deserializing ${retval.commandName} parameter ${parameter.paramName}: expected enum at ${index}, but got none`);
                    }
                } else if (parameter.paramType & AvailableCommandsPacket.ARG_FLAG_POSTFIX) {
                    let index = (parameter.paramType & 0xffff);
                    parameter.postfix = this.postfixes[index] || null;
                    if (parameter.postfix === null) {
                        throw new RangeError(`deserializing ${retval.commandName} parameter ${parameter.paramName}: expected enum at ${index}, but got none`);
                    }
                } else if ((parameter.paramType & AvailableCommandsPacket.ARG_FLAG_VALID) === 0) {
                    throw new RangeError(`deserializing ${retval.commandName} parameter ${parameter.paramName}: Invalid parameter type 0x" . ${parameter.paramType.toString("hex")}`);
                }

                retval.overloads[overloadIndex][paramIndex] = parameter;
            }
        }

        return retval;
    }

    putCommandData(data) {
        this.writeString(data.commandName);
        this.writeString(data.commandDescription);
        this.writeByte(data.flag);
        this.writeByte(data.permission);

        if (data.aliases !== null) {
            this.writeLInt(this.enumMap[data.aliases.enumName] || -1);
        } else {
            this.writeLInt(-1);
        }

        this.writeUnsignedVarInt(data.overloads.length);
        data.overloads.forEach(overload => {
            this.writeUnsignedVarInt(overload.length);
            overload.forEach(parameter => {
                this.writeString(parameter.paramName);

                let type;
                if (parameter.enum !== null) {
                    type = AvailableCommandsPacket.ARG_FLAG_ENUM | AvailableCommandsPacket.ARG_FLAG_VALID | (this.enumMap[parameter.enum.enumName] || -1);
                } else if (parameter.postfix !== null) {
                    let key = this.postfixes.indexOf(parameter.postfix);
                    if (key === -1) {
                        throw new Error(`Postfix '${parameter.postfix}' not in postfixes array"`);
                    }
                    type = AvailableCommandsPacket.ARG_FLAG_POSTFIX | key;
                } else {
                    type = parameter.paramType;
                }
                this.writeLInt(type);
                this.writeBool(parameter.isOptional);
                this.writeByte(parameter.byte1);
            });
        });
    }

    //TODO: argTypeToString(){}

    _encodePayload() {
        let enumValuesMap = {};
        let postfixesMap = {};
        let enumMap = {};
        this.commandData.forEach(commandData => {
            if (commandData.aliases !== null) {
                enumMap[commandData.aliases.enumName] = commandData.aliases;

                commandData.aliases.enumValues.forEach(str => {
                    enumValuesMap[str] = true;
                });
            }

            commandData.overloads.forEach(overload => {
                overload.forEach(parameter => {
                    if (parameter.enum !== null) {
                        enumMap[parameter.enum.enumValues] = parameter.enum;
                        parameter.enum.enumValues.forEach(str => {
                            enumValuesMap[str] = true;
                        });
                    }

                    if (parameter.postfix !== null) {
                        postfixesMap[parameter.postfix] = true;
                    }
                });
            });
        });

        this.enumValues = Object.keys(enumValuesMap);
        this.writeUnsignedVarInt(Object.keys(this.enumValues).length);
        this.enumValues.forEach(enumValue => {
            this.writeString(enumValue);
        });

        this.postfixes = Object.keys(postfixesMap);
        this.writeUnsignedVarInt(Object.keys(this.postfixes).length);
        this.postfixes.forEach(postfix => {
            this.writeString(postfix);
        });

        this.enums = Object.values(enumMap);
        this.enumMap = flipArray(Object.keys(enumMap));
        this.writeUnsignedVarInt(Object.keys(this.enums).length);
        this.enums.forEach(enumVal => {
            this.putEnum(enumVal);
        });

        this.writeUnsignedVarInt(Object.keys(this.commandData).length);
        Object.keys(this.commandData).forEach(data => {
            this.putCommandData(this.commandData[data]);
        });

        this.writeUnsignedVarInt(Object.keys(this.softEnums).length);
        Object.keys(this.softEnums).forEach(enumVal => {
            this.putSoftEnum(this.softEnums[enumVal]);
        });
    }

    handle(session) {
        return session.handleAvailableCommands(this);
    }
}

module.exports = AvailableCommandsPacket;