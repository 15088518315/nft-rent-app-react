
function getCollectibles() {
    const url = getOpenSeaHostname + "/api/v1/assets/?owner=" + lend721_contract_address + "&exclude_currencies=true&order_by=listing_date&order_direction=asc&limit=200";
    const data = null;
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            console.log(this.responseText);
            let data = jQuery.parseJSON(this.responseText);
            let assets = data.assets;
            if (assets && assets.length > 0) {
                collectibles = new Array();
                collectionsMap = new Map();
                assets.forEach(function (asset) {
                    let contract = asset.asset_contract;
                    let collectibleToBorrow = new CollectibleToBorrow(asset.id.toString(),asset.token_id, contract.address, contract.name,
                        asset.name, asset.image_thumbnail_url, asset.image_url);
                    collectibles.push(collectibleToBorrow);
                    let collectionByAddr = collectionsMap.get(collectibleToBorrow.contractAddr);
                    if (collectionByAddr && collectionByAddr.size > 0) {
                        collectionByAddr.size++;
                    } else {
                        let collectionById = new Collection(collectibleToBorrow.contractAddr, collectibleToBorrow.name, 1);
                        collectionsMap.set(collectibleToBorrow.contractAddr, collectionById);
                    }
                })
                showCollectibles(collectibles);
                showCollections(collectibles,collectionsMap);
                $('#loading').loading("stop");
                $('#div_main_collectibles').show();
                getCollectionInfoFromLend721(collectibles);
            }
        }
    });

    xhr.open("GET", url);
    xhr.send(data);
}

