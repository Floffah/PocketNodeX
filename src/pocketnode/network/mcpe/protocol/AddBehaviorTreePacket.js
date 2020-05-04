const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");

"use strict";

class AddBehaviorTreePacket extends DataPacket {
    static NETWORK_ID = ProtocolInfo.ADD_BEHAVIOR_TREE_PACKET;

    /** @type {string} */
    behaviorTreeJson = "";

    _decodePayload() {
        this.behaviorTreeJson = this.readString();
    }

    _encodePayload() {
        this.writeString(this.behaviorTreeJson);
    }

    handle(session) {
        return session.handleAddBehaviorTree(this);
    }
}

module.exports = AddBehaviorTreePacket;