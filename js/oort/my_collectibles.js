
function getCollectibles() {

    const data = null;

    const xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            let data = jQuery.parseJSON(this.responseText);
            let assets = data.assets;
            if (assets && assets.length > 0) {
                collectibles = new Array();
                collectionsMap = new Map();
                for (let i = 0; i < assets.length; i++) {
                    let asset = assets[i];
                    let contract = asset.asset_contract;
                    let collectionItem = new Collectible(asset.id.toString(), asset.token_id, contract.address,contract.name, asset.name, asset.image_thumbnail_url, asset.image_url);
                    collectibles.push(collectionItem);
                    let collectionByAddr = collectionsMap.get(collectionItem.contractAddr);
                    if (collectionByAddr && collectionByAddr.size > 0) {
                        collectionByAddr.size++;
                    } else {
                        let collectionById = new Collection(collectionItem.contractAddr, collectionItem.name, 1);
                        collectionsMap.set(collectionItem.contractAddr, collectionById);
                    }
                }
                showCollectibles(collectibles);
                showCollections(collectibles,collectionsMap);
                $('#loading').loading("stop");
                $('#div_main_collectibles').show();
            }
        }
    });

    xhr.open("GET", getOpenSeaHostname + "/api/v1/assets?owner=" + parent.account +
        "&order_direction=desc&offset=0&limit=20");

    xhr.send(data);
}
