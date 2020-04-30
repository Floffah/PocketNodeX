const LoginPacket = require("./LoginPacket");
const AnimatePacket = require("./AnimatePacket");
const SetActorDataPacket = require("./SetActorDataPacket");
const PlayStatusPacket = require("./PlayStatusPacket");
const DisconnectPacket = require("./DisconnectPacket");
const MovePlayerPacket = require("./MovePlayerPacket");
const NetworkStackLatencyPacket = require("./NetworkStackLatencyPacket");
const PlayerActionPacket = require("./PlayerActionPacket");
const PlayerHotbarPacket = require("./PlayerHotbarPacket");
const PlayerInputPacket = require("./PlayerInputPacket");
const InteractPacket = require("./InteractPacket");
const LevelSoundEventPacket = require("./LevelSoundEventPacket");
const SubClientLoginPacket = require("./SubClientLoginPacket");
const PlayerSkinPacket = require("./PlayerSkinPacket");
const BlockEventPacket = require("./BlockEventPacket");
const UpdateAttributesPacket = require("./UpdateAttributesPacket");
const StructureBlockUpdatePacket = require("./StructureBlockUpdatePacket");
const ResourcePackClientResponsePacket = require("./ResourcePackClientResponsePacket");
const ResourcePackStackPacket = require("./ResourcePackStackPacket");
const ResourcePacksInfoPacket = require("./ResourcePacksInfoPacket");
const ResourcePackChunkRequestPacket = require("./ResourcePackChunkRequestPacket");
const ServerToClientHandshakePacket = require("./ServerToClientHandshakePacket");
const SetScoreboardIdentityPacket = require("./SetScoreboardIdentityPacket");
const ClientToServerHandshakePacket = require("./ClientToServerHandshakePacket");
const RequestChunkRadiusPacket = require("./RequestChunkRadiusPacket");
const UpdateSoftEnumPacket = require("./UpdateSoftEnumPacket");
const SetLocalPlayerAsInitializedPacket = require("./SetLocalPlayerAsInitializedPacket");
const StartGamePacket = require("./StartGamePacket");
const SetTimePacket = require("./SetTimePacket");
const BiomeDefinitionListPacket = require("./BiomeDefinitionListPacket");
const CommandOutputPacket = require("./CommandOutputPacket");
const CommandRequestPacket = require("./CommandRequestPacket");
const TextPacket = require("./TextPacket");
const SetDefaultGameTypePacket = require("./SetDefaultGameTypePacket");
const SetPlayerGameTypePacket = require("./SetPlayerGameTypePacket");
const AddPlayerPacket = require("./AddPlayerPacket");
const AddEntityPacket = require("./AddEntityPacket");
const ActorEventPacket = require("./ActorEventPacket");
const AddActorPacket = require("./AddActorPacket");
const RemoveActorPacket = require("./RemoveActorPacket");
const AddItemActorPacket = require("./AddItemActorPacket");
const AddPaintingPacket = require("./AddPaintingPacket");
const AddBehaviorTreePacket = require("./AddBehaviorTreePacket");
const AvailableCommandsPacket = require("./AvailableCommandsPacket");
const AutomationClientConnectPacket = require("./AutomationClientConnectPacket");
const TakeItemActorPacket = require("./TakeItemActorPacket");
const MoveActorAbsolutePacket = require("./MoveActorAbsolutePacket");
const RiderJumpPacket = require("./RiderJumpPacket");
const UpdateBlockPacket = require("./UpdateBlockPacket");
const BlockPickRequestPacket = require("./BlockPickRequestPacket");
const SetTitlePacket = require("./SetTitlePacket");
const TickSyncPacket = require("./TickSyncPacket");
const LevelSoundEventPacketV1 = require("./LevelSoundEventPacketV1");
const ResourcePackChunkDataPacket = require("./ResourcePackChunkDataPacket");
const ResourcePackChunkResponsePacket = require("./ResourcePackClientResponsePacket");
const ResourcePackDataInfoPacket = require("./ResourcePackDataInfoPacket");
const LevelEventPacket = require("./LevelEventPacket");
const MobEffectPacket = require("./MobEffectPacket");
const AdventureSettingsPacket = require("./AdventureSettingsPacket");
const InventoryTransactionPacket = require("./InventoryTransactionPacket");
const MobEquipmentPacket = require("./MobEquipmentPacket");
const MobArmorEquipmentPacket = require("./MobArmorEquipmentPacket");
const AvailableActorIdentifiersPacket = require("./AvailableActorIdentifiersPacket");
const ActorFallPacket = require("./ActorFallPacket");
const LevelChunkPacket = require("./LevelChunkPacket");
const ActorPickRequestPacket = require("./ActorPickRequestPacket");

class PacketPool {

    constructor() {
        this.packetPool = new Map();
        this.registerPackets();
    }

    registerPacket(packet) {
        this.packetPool.set(packet.getId(), packet);
    }

    getPacket(id) {
        return this.packetPool.has(id) ? new (this.packetPool.get(id))() : null;
    }

    isRegistered(id) {
        return this.packetPool.has(id);
    }

    registerPackets() {
        this.registerPacket(LoginPacket);
        this.registerPacket(PlayStatusPacket);
        this.registerPacket(ServerToClientHandshakePacket);
        this.registerPacket(ClientToServerHandshakePacket);
        this.registerPacket(DisconnectPacket);
        this.registerPacket(ResourcePacksInfoPacket);
        this.registerPacket(ResourcePackStackPacket);
        this.registerPacket(ResourcePackClientResponsePacket);
        this.registerPacket(TextPacket);
        this.registerPacket(SetTimePacket);
        this.registerPacket(StartGamePacket);
        this.registerPacket(AddPlayerPacket);
        this.registerPacket(AddActorPacket);
        this.registerPacket(RemoveActorPacket);
        this.registerPacket(AddItemActorPacket);
        this.registerPacket(TakeItemActorPacket);
        this.registerPacket(MoveActorAbsolutePacket);
        this.registerPacket(MovePlayerPacket);
        this.registerPacket(RiderJumpPacket);
        this.registerPacket(UpdateBlockPacket);
        this.registerPacket(AddPaintingPacket);
        this.registerPacket(TickSyncPacket);
        this.registerPacket(LevelSoundEventPacketV1);
        this.registerPacket(LevelEventPacket);
        this.registerPacket(BlockEventPacket);
        this.registerPacket(ActorEventPacket);
        this.registerPacket(MobEffectPacket);
        this.registerPacket(UpdateAttributesPacket);
        this.registerPacket(InventoryTransactionPacket);
        this.registerPacket(MobEquipmentPacket);
        this.registerPacket(MobArmorEquipmentPacket);
        this.registerPacket(InteractPacket);

        this.registerPacket(ActorPickRequestPacket);
        this.registerPacket(AddBehaviorTreePacket);
        this.registerPacket(AddEntityPacket);
        this.registerPacket(AdventureSettingsPacket);
        this.registerPacket(BlockPickRequestPacket);
        this.registerPacket(PlayerHotbarPacket);
        this.registerPacket(PlayerInputPacket);
        this.registerPacket(ResourcePackChunkDataPacket);
        this.registerPacket(ResourcePackChunkResponsePacket);
        this.registerPacket(ResourcePackDataInfoPacket);

        this.registerPacket(LevelSoundEventPacket);
        this.registerPacket(PlayerActionPacket);
        this.registerPacket(ActorFallPacket);
        this.registerPacket(PlayerInputPacket);
        this.registerPacket(LevelChunkPacket);

        this.registerPacket(UpdateSoftEnumPacket);
        this.registerPacket(AnimatePacket);
        this.registerPacket(PlayerSkinPacket);
        this.registerPacket(SetScoreboardIdentityPacket);
        this.registerPacket(SetActorDataPacket);

        this.registerPacket(SetLocalPlayerAsInitializedPacket);
        this.registerPacket(SetDefaultGameTypePacket);
        this.registerPacket(SetPlayerGameTypePacket);
        this.registerPacket(NetworkStackLatencyPacket);
        this.registerPacket(StructureBlockUpdatePacket);
        this.registerPacket(SubClientLoginPacket);
        this.registerPacket(ResourcePackChunkRequestPacket);
        this.registerPacket(BiomeDefinitionListPacket);
        this.registerPacket(RequestChunkRadiusPacket);
        this.registerPacket(CommandOutputPacket);
        this.registerPacket(CommandRequestPacket);
        this.registerPacket(AvailableCommandsPacket);
        this.registerPacket(AutomationClientConnectPacket);
        this.registerPacket(AvailableActorIdentifiersPacket);
        this.registerPacket(SetTitlePacket);
    }
}

module.exports = PacketPool;