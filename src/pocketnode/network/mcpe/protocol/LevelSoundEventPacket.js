const DataPacket = require("./DataPacket");
const ProtocolInfo = require("../Info");
const Vector3 = require("../../../math/Vector3");

class LevelSoundEventPacket extends DataPacket {
    static getId() {
        return ProtocolInfo.LEVEL_SOUND_EVENT_PACKET;
    }

    static get SOUND_ITEM_USE_ON() {
        return 0
    };

    static get SOUND_HIT() {
        return 1
    };

    static get SOUND_STEP() {
        return 2
    };

    static get SOUND_FLY() {
        return 3
    };

    static get SOUND_JUMP() {
        return 4
    };

    static get SOUND_BREAK() {
        return 5
    };

    static get SOUND_PLACE() {
        return 6
    };

    static get SOUND_HEAVY_STEP() {
        return 7
    };

    static get SOUND_GALLOP() {
        return 8
    };

    static get SOUND_FALL() {
        return 9
    };

    static get SOUND_AMBIENT() {
        return 10
    };

    static get SOUND_AMBIENT_BABY() {
        return 11
    };

    static get SOUND_AMBIENT_IN_WATER() {
        return 12
    };

    static get SOUND_BREATHE() {
        return 13
    };

    static get SOUND_DEATH() {
        return 14
    };

    static get SOUND_DEATH_IN_WATER() {
        return 15
    };

    static get SOUND_DEATH_TO_ZOMBIE() {
        return 16
    };

    static get SOUND_HURT() {
        return 17
    };

    static get SOUND_HURT_IN_WATER() {
        return 18
    };

    static get SOUND_MAD() {
        return 19
    };

    static get SOUND_BOOST() {
        return 20
    };

    static get SOUND_BOW() {
        return 21
    };

    static get SOUND_SQUISH_BIG() {
        return 22
    };

    static get SOUND_SQUISH_SMALL() {
        return 23
    };

    static get SOUND_FALL_BIG() {
        return 24
    };

    static get SOUND_FALL_SMALL() {
        return 25
    };

    static get SOUND_SPLASH() {
        return 26
    };

    static get SOUND_FIZZ() {
        return 27
    };

    static get SOUND_FLAP() {
        return 28
    };

    static get SOUND_SWIM() {
        return 29
    };

    static get SOUND_DRINK() {
        return 30
    };

    static get SOUND_EAT() {
        return 31
    };

    static get SOUND_TAKEOFF() {
        return 32
    };

    static get SOUND_SHAKE() {
        return 33
    };

    static get SOUND_PLOP() {
        return 34
    };

    static get SOUND_LAND() {
        return 35
    };

    static get SOUND_SADDLE() {
        return 36
    };

    static get SOUND_ARMOR() {
        return 37
    };

    static get SOUND_MOB_ARMOR_STAND_PLACE() {
        return 38
    };

    static get SOUND_ADD_CHEST() {
        return 39
    };

    static get SOUND_THROW() {
        return 40
    };

    static get SOUND_ATTACK() {
        return 41
    };

    static get SOUND_ATTACK_NODAMAGE() {
        return 42
    };

    static get SOUND_ATTACK_STRONG() {
        return 43
    };

    static get SOUND_WARN() {
        return 44
    };

    static get SOUND_SHEAR() {
        return 45
    };

    static get SOUND_MILK() {
        return 46
    };

    static get SOUND_THUNDER() {
        return 47
    };

    static get SOUND_EXPLODE() {
        return 48
    };

    static get SOUND_FIRE() {
        return 49
    };

    static get SOUND_IGNITE() {
        return 50
    };

    static get SOUND_FUSE() {
        return 51
    };

    static get SOUND_STARE() {
        return 52
    };

    static get SOUND_SPAWN() {
        return 53
    };

    static get SOUND_SHOOT() {
        return 54
    };

    static get SOUND_BREAK_BLOCK() {
        return 55
    };

    static get SOUND_LAUNCH() {
        return 56
    };

    static get SOUND_BLAST() {
        return 57
    };

    static get SOUND_LARGE_BLAST() {
        return 58
    };

    static get SOUND_TWINKLE() {
        return 59
    };

    static get SOUND_REMEDY() {
        return 60
    };

    static get SOUND_UNFECT() {
        return 61
    };

    static get SOUND_LEVELUP() {
        return 62
    };

    static get SOUND_BOW_HIT() {
        return 63
    };

    static get SOUND_BULLET_HIT() {
        return 64
    };

    static get SOUND_EXTINGUISH_FIRE() {
        return 65
    };

    static get SOUND_ITEM_FIZZ() {
        return 66
    };

    static get SOUND_CHEST_OPEN() {
        return 67
    };

    static get SOUND_CHEST_CLOSED() {
        return 68
    };

    static get SOUND_SHULKERBOX_OPEN() {
        return 69
    };

    static get SOUND_SHULKERBOX_CLOSED() {
        return 70
    };

    static get SOUND_ENDERCHEST_OPEN() {
        return 71
    };

    static get SOUND_ENDERCHEST_CLOSED() {
        return 72
    };

    static get SOUND_POWER_ON() {
        return 73
    };

    static get SOUND_POWER_OFF() {
        return 74
    };

    static get SOUND_ATTACH() {
        return 75
    };

    static get SOUND_DETACH() {
        return 76
    };

    static get SOUND_DENY() {
        return 77
    };

    static get SOUND_TRIPOD() {
        return 78
    };

    static get SOUND_POP() {
        return 79
    };

    static get SOUND_DROP_SLOT() {
        return 80
    };

    static get SOUND_NOTE() {
        return 81
    };

    static get SOUND_THORNS() {
        return 82
    };

    static get SOUND_PISTON_IN() {
        return 83
    };

    static get SOUND_PISTON_OUT() {
        return 84
    };

    static get SOUND_PORTAL() {
        return 85
    };

    static get SOUND_WATER() {
        return 86
    };

    static get SOUND_LAVA_POP() {
        return 87
    };

    static get SOUND_LAVA() {
        return 88
    };

    static get SOUND_BURP() {
        return 89
    };

    static get SOUND_BUCKET_FILL_WATER() {
        return 90
    };

    static get SOUND_BUCKET_FILL_LAVA() {
        return 91
    };

    static get SOUND_BUCKET_EMPTY_WATER() {
        return 92
    };

    static get SOUND_BUCKET_EMPTY_LAVA() {
        return 93
    };

    static get SOUND_ARMOR_EQUIP_CHAIN() {
        return 94
    };

    static get SOUND_ARMOR_EQUIP_DIAMOND() {
        return 95
    };

    static get SOUND_ARMOR_EQUIP_GENERIC() {
        return 96
    };

    static get SOUND_ARMOR_EQUIP_GOLD() {
        return 97
    };

    static get SOUND_ARMOR_EQUIP_IRON() {
        return 98
    };

    static get SOUND_ARMOR_EQUIP_LEATHER() {
        return 99
    };

    static get SOUND_ARMOR_EQUIP_ELYTRA() {
        return 100
    };

    static get SOUND_RECORD_13() {
        return 101
    };

    static get SOUND_RECORD_CAT() {
        return 102
    };

    static get SOUND_RECORD_BLOCKS() {
        return 103
    };

    static get SOUND_RECORD_CHIRP() {
        return 104
    };

    static get SOUND_RECORD_FAR() {
        return 105
    };

    static get SOUND_RECORD_MALL() {
        return 106
    };

    static get SOUND_RECORD_MELLOHI() {
        return 107
    };

    static get SOUND_RECORD_STAL() {
        return 108
    };

    static get SOUND_RECORD_STRAD() {
        return 109
    };

    static get SOUND_RECORD_WARD() {
        return 110
    };

    static get SOUND_RECORD_11() {
        return 111
    };

    static get SOUND_RECORD_WAIT() {
        return 112
    };

    static get SOUND_STOP_RECORD() {
        return 113
    }; //Not really a sound

    static get SOUND_FLOP() {
        return 114
    };

    static get SOUND_ELDERGUARDIAN_CURSE() {
        return 115
    };

    static get SOUND_MOB_WARNING() {
        return 116
    };

    static get SOUND_MOB_WARNING_BABY() {
        return 117
    };

    static get SOUND_TELEPORT() {
        return 118
    };

    static get SOUND_SHULKER_OPEN() {
        return 119
    };

    static get SOUND_SHULKER_CLOSE() {
        return 120
    };

    static get SOUND_HAGGLE() {
        return 121
    };

    static get SOUND_HAGGLE_YES() {
        return 122
    };

    static get SOUND_HAGGLE_NO() {
        return 123
    };

    static get SOUND_HAGGLE_IDLE() {
        return 124
    };

    static get SOUND_CHORUSGROW() {
        return 125
    };

    static get SOUND_CHORUSDEATH() {
        return 126
    };

    static get SOUND_GLASS() {
        return 127
    };

    static get SOUND_POTION_BREWED() {
        return 128
    };

    static get SOUND_CAST_SPELL() {
        return 129
    };

    static get SOUND_PREPARE_ATTACK() {
        return 130
    };

    static get SOUND_PREPARE_SUMMON() {
        return 131
    };

    static get SOUND_PREPARE_WOLOLO() {
        return 132
    };

    static get SOUND_FANG() {
        return 133
    };

    static get SOUND_CHARGE() {
        return 134
    };

    static get SOUND_CAMERA_TAKE_PICTURE() {
        return 135
    };

    static get SOUND_LEASHKNOT_PLACE() {
        return 136
    };

    static get SOUND_LEASHKNOT_BREAK() {
        return 137
    };

    static get SOUND_GROWL() {
        return 138
    };

    static get SOUND_WHINE() {
        return 139
    };

    static get SOUND_PANT() {
        return 140
    };

    static get SOUND_PURR() {
        return 141
    };

    static get SOUND_PURREOW() {
        return 142
    };

    static get SOUND_DEATH_MIN_VOLUME() {
        return 143
    };

    static get SOUND_DEATH_MID_VOLUME() {
        return 144
    };

    static get SOUND_IMITATE_BLAZE() {
        return 145
    };

    static get SOUND_IMITATE_CAVE_SPIDER() {
        return 146
    };

    static get SOUND_IMITATE_CREEPER() {
        return 147
    };

    static get SOUND_IMITATE_ELDER_GUARDIAN() {
        return 148
    };

    static get SOUND_IMITATE_ENDER_DRAGON() {
        return 149
    };

    static get SOUND_IMITATE_ENDERMAN() {
        return 150
    };

    static get SOUND_IMITATE_EVOCATION_ILLAGER() {
        return 152
    };

    static get SOUND_IMITATE_GHAST() {
        return 153
    };

    static get SOUND_IMITATE_HUSK() {
        return 154
    };

    static get SOUND_IMITATE_ILLUSION_ILLAGER() {
        return 155
    };

    static get SOUND_IMITATE_MAGMA_CUBE() {
        return 156
    };

    static get SOUND_IMITATE_POLAR_BEAR() {
        return 157
    };

    static get SOUND_IMITATE_SHULKER() {
        return 158
    };

    static get SOUND_IMITATE_SILVERFISH() {
        return 159
    };

    static get SOUND_IMITATE_SKELETON() {
        return 160
    };

    static get SOUND_IMITATE_SLIME() {
        return 161
    };

    static get SOUND_IMITATE_SPIDER() {
        return 162
    };

    static get SOUND_IMITATE_STRAY() {
        return 163
    };

    static get SOUND_IMITATE_VEX() {
        return 164
    };

    static get SOUND_IMITATE_VINDICATION_ILLAGER() {
        return 165
    };

    static get SOUND_IMITATE_WITCH() {
        return 166
    };

    static get SOUND_IMITATE_WITHER() {
        return 167
    };

    static get SOUND_IMITATE_WITHER_SKELETON() {
        return 168
    };

    static get SOUND_IMITATE_WOLF() {
        return 169
    };

    static get SOUND_IMITATE_ZOMBIE() {
        return 170
    };

    static get SOUND_IMITATE_ZOMBIE_PIGMAN() {
        return 171
    };

    static get SOUND_IMITATE_ZOMBIE_VILLAGER() {
        return 172
    };

    static get SOUND_BLOCK_END_PORTAL_FRAME_FILL() {
        return 173
    };

    static get SOUND_BLOCK_END_PORTAL_SPAWN() {
        return 174
    };

    static get SOUND_RANDOM_ANVIL_USE() {
        return 175
    };

    static get SOUND_BOTTLE_DRAGONBREATH() {
        return 176
    };

    static get SOUND_PORTAL_TRAVEL() {
        return 177
    };

    static get SOUND_ITEM_TRIDENT_HIT() {
        return 178
    };

    static get SOUND_ITEM_TRIDENT_RETURN() {
        return 179
    };

    static get SOUND_ITEM_TRIDENT_RIPTIDE_1() {
        return 180
    };

    static get SOUND_ITEM_TRIDENT_RIPTIDE_2() {
        return 181
    };

    static get SOUND_ITEM_TRIDENT_RIPTIDE_3() {
        return 182
    };

    static get SOUND_ITEM_TRIDENT_THROW() {
        return 183
    };

    static get SOUND_ITEM_TRIDENT_THUNDER() {
        return 184
    };

    static get SOUND_ITEM_TRIDENT_HIT_GROUND() {
        return 185
    };

    static get SOUND_DEFAULT() {
        return 186
    };

    static get SOUND_BLOCK_FLETCHING_TABLE_USE() {
        return 187
    };

    static get SOUND_ELEMCONSTRUCT_OPEN() {
        return 188
    };

    static get SOUND_ICEBOMB_HIT() {
        return 189
    };

    static get SOUND_BALLOONPOP() {
        return 190
    };

    static get SOUND_LT_REACTION_ICEBOMB() {
        return 191
    };

    static get SOUND_LT_REACTION_BLEACH() {
        return 192
    };

    static get SOUND_LT_REACTION_EPASTE() {
        return 193
    };

    static get SOUND_LT_REACTION_EPASTE2() {
        return 194
    };

    static get SOUND_LT_REACTION_FERTILIZER() {
        return 199
    };

    static get SOUND_LT_REACTION_FIREBALL() {
        return 200
    };

    static get SOUND_LT_REACTION_MGSALT() {
        return 201
    };

    static get SOUND_LT_REACTION_MISCFIRE() {
        return 202
    };

    static get SOUND_LT_REACTION_FIRE() {
        return 203
    };

    static get SOUND_LT_REACTION_MISCEXPLOSION() {
        return 204
    };

    static get SOUND_LT_REACTION_MISCMYSTICAL() {
        return 205
    };

    static get SOUND_LT_REACTION_MISCMYSTICAL2() {
        return 206
    };

    static get SOUND_LT_REACTION_PRODUCT() {
        return 207
    };

    static get SOUND_SPARKLER_USE() {
        return 208
    };

    static get SOUND_GLOWSTICK_USE() {
        return 209
    };

    static get SOUND_SPARKLER_ACTIVE() {
        return 210
    };

    static get SOUND_CONVERT_TO_DROWNED() {
        return 211
    };

    static get SOUND_BUCKET_FILL_FISH() {
        return 212
    };

    static get SOUND_BUCKET_EMPTY_FISH() {
        return 213
    };

    static get SOUND_BUBBLE_UP() {
        return 214
    };

    static get SOUND_BUBBLE_DOWN() {
        return 215
    };

    static get SOUND_BUBBLE_POP() {
        return 216
    };

    static get SOUND_BUBBLE_UPINSIDE() {
        return 217
    };

    static get SOUND_BUBBLE_DOWNINSIDE() {
        return 218
    };

    static get SOUND_HURT_BABY() {
        return 219
    };

    static get SOUND_DEATH_BABY() {
        return 220
    };

    static get SOUND_STEP_BABY() {
        return 221
    };

    static get SOUND_BORN() {
        return 223
    };

    static get SOUND_BLOCK_TURTLE_EGG_BREAK() {
        return 224
    };

    static get SOUND_BLOCK_TURTLE_EGG_CRACK() {
        return 225
    };

    static get SOUND_BLOCK_TURTLE_EGG_HATCH() {
        return 226
    };

    static get SOUND_BLOCK_TURTLE_EGG_ATTACK() {
        return 228
    };

    static get SOUND_BEACON_ACTIVATE() {
        return 229
    };

    static get SOUND_BEACON_AMBIENT() {
        return 230
    };

    static get SOUND_BEACON_DEACTIVATE() {
        return 231
    };

    static get SOUND_BEACON_POWER() {
        return 232
    };

    static get SOUND_CONDUIT_ACTIVATE() {
        return 233
    };

    static get SOUND_CONDUIT_AMBIENT() {
        return 234
    };

    static get SOUND_CONDUIT_ATTACK() {
        return 235
    };

    static get SOUND_CONDUIT_DEACTIVATE() {
        return 236
    };

    static get SOUND_CONDUIT_SHORT() {
        return 237
    };

    static get SOUND_SWOOP() {
        return 238
    };

    static get SOUND_BLOCK_BAMBOO_SAPLING_PLACE() {
        return 239
    };

    static get SOUND_PRESNEEZE() {
        return 240
    };

    static get SOUND_SNEEZE() {
        return 241
    };

    static get SOUND_AMBIENT_TAME() {
        return 242
    };

    static get SOUND_SCARED() {
        return 243
    };

    static get SOUND_BLOCK_SCAFFOLDING_CLIMB() {
        return 244
    };

    static get SOUND_CROSSBOW_LOADING_START() {
        return 245
    };

    static get SOUND_CROSSBOW_LOADING_MIDDLE() {
        return 246
    };

    static get SOUND_CROSSBOW_LOADING_END() {
        return 247
    };

    static get SOUND_CROSSBOW_SHOOT() {
        return 248
    };

    static get SOUND_CROSSBOW_QUICK_CHARGE_START() {
        return 249
    };

    static get SOUND_CROSSBOW_QUICK_CHARGE_MIDDLE() {
        return 250
    };

    static get SOUND_CROSSBOW_QUICK_CHARGE_END() {
        return 251
    };

    static get SOUND_AMBIENT_AGGRESSIVE() {
        return 252
    };

    static get SOUND_AMBIENT_WORRIED() {
        return 253
    };

    static get SOUND_CANT_BREED() {
        return 254
    };

    static get SOUND_ITEM_SHIELD_BLOCK() {
        return 255
    };

    static get SOUND_ITEM_BOOK_PUT() {
        return 256
    };

    static get SOUND_BLOCK_GRINDSTONE_USE() {
        return 257
    };

    static get SOUND_BLOCK_BELL_HIT() {
        return 258
    };

    static get SOUND_BLOCK_CAMPFIRE_CRACKLE() {
        return 259
    };

    static get SOUND_ROAR() {
        return 260
    };

    static get SOUND_STUN() {
        return 261
    };

    static get SOUND_BLOCK_SWEET_BERRY_BUSH_HURT() {
        return 262
    };

    static get SOUND_BLOCK_SWEET_BERRY_BUSH_PICK() {
        return 263
    };

    static get SOUND_BLOCK_CARTOGRAPHY_TABLE_USE() {
        return 264
    };

    static get SOUND_BLOCK_STONECUTTER_USE() {
        return 265
    };

    static get SOUND_BLOCK_COMPOSTER_EMPTY() {
        return 266
    };

    static get SOUND_BLOCK_COMPOSTER_FILL() {
        return 267
    };

    static get SOUND_BLOCK_COMPOSTER_FILL_SUCCESS() {
        return 268
    };

    static get SOUND_BLOCK_COMPOSTER_READY() {
        return 269
    };

    static get SOUND_BLOCK_BARREL_OPEN() {
        return 270
    };

    static get SOUND_BLOCK_BARREL_CLOSE() {
        return 271
    };

    static get SOUND_RAID_HORN() {
        return 272
    };

    static get SOUND_BLOCK_LOOM_USE() {
        return 273
    };

    static get SOUND_AMBIENT_IN_RAID() {
        return 274
    };

    static get SOUND_UI_CARTOGRAPHY_TABLE_TAKE_RESULT() {
        return 275
    };

    static get SOUND_UI_STONECUTTER_TAKE_RESULT() {
        return 276
    };

    static get SOUND_UI_LOOM_TAKE_RESULT() {
        return 277
    };

    static get SOUND_BLOCK_SMOKER_SMOKE() {
        return 278
    };

    static get SOUND_BLOCK_BLASTFURNACE_FIRE_CRACKLE() {
        return 279
    };

    static get SOUND_BLOCK_SMITHING_TABLE_USE() {
        return 280
    };

    static get SOUND_UNDEFINED() {
        return 281
    };

    /** @type {number} */
    sound;
    /** @type {Vector3} */
    position = new Vector3();
    /** @type {number} */
    extraData;
    /** @type {string} */
    entityType = ":";
    /** @type {boolean} */
    isBabyMob = false;
    /** @type {boolean} */
    disableRelativeVolume = false;

    _decodePayload() {
        this.sound = this.readUnsignedVarInt();
        this.position = this.readVector3();
        this.extraData = this.readVarInt();
        this.entityType = this.readString();
        this.isBabyMob = this.readBool();
        this.disableRelativeVolume = this.readBool();
    }

    _encodePayload() {
        this.writeUnsignedVarInt(this.sound);
        this.writeVector3(this.position);
        this.writeVarInt(this.extraData);
        this.writeString(this.entityType);
        this.writeBool(this.isBabyMob);
        this.writeBool(this.disableRelativeVolume);
    }

    handle(session) {
        return session.handleLevelSoundEvent(this);
    }
}

module.exports = LevelSoundEventPacket;