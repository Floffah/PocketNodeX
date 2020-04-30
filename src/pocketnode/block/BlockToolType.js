/**
 * Types of tools that can be used to break blocks
 * Blocks may allow multiple tool types by combining these bitflags
 */
class BlockToolType {

    static get TYPE_NONE() {
        return 0
    };

    static get TYPE_SWORD() {
        return 1 << 0
    };

    static get TYPE_SHOVEL() {
        return 1 << 1
    };

    static get TYPE_PICKAXE() {
        return 1 << 2
    };

    static get TYPE_AXE() {
        return 1 << 3
    };

    static get TYPE_SHEARS() {
        return 1 << 4
    };

}

module.exports = BlockToolType;