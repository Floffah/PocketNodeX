const SkinData = require('./SkinData');
const SkinImage = require('./SkinImage');
const Skin = require('../../../../entity/Skin');
const Crypto = require('crypto');

class LegacySkinAdapter {

    /**
     * @param skin {Skin}
     * @return {SkinData}
     */
    toSkinData(skin) {
        let capeData = skin.getCapeData();
        let capeImage = capeData === "" ? new SkinImage(0, 0, "") : new SkinImage(32, 64, capeData);
        let geometryName = skin.getGeometryName();
        if (geometryName === "") {
            geometryName = "geometry.humanoid.custom";
        }
        return new SkinData(
            skin.getSkinId(),
            JSON.stringify({'geometry': {'default': geometryName}}),  // dude, why?
            SkinImage.fromLegacy(skin.getSkinData()), [],
            capeImage,
            skin.getGeometryData()
        )
    }

    /**
     * @param data {SkinData}
     *
     * @return {Skin}
     */
    fromSkinData(data) {
        if (data.isPersona()) {
            return new Skin(
                'Standard_Custom',
                Crypto.randomBytes(3).toString('hex')+'\xff'.repeat(2048)
            );
        }

        let capeData = data.isPersonaCapeOnClassic() ? "" : data.getCapeImage().getData();

        let geometryName = "";
        let resourcePatch = JSON.parse(data.getResourcePatch(), true);
        if (typeof resourcePatch['geometry']['default'] !== 'undefined' &&
            typeof resourcePatch['geometry']['default'] === 'string') {
            geometryName = resourcePatch['geometry']['default'];
        }else{
            //TODO: Kick for invalid skin
            console.log('Invalid skin, need to handle kick');
        }

        return new Skin(data.getSkinId(), data.getSkinImage().getData(), capeData, geometryName, data.getGeometryData());
    }
}
module.exports = LegacySkinAdapter;