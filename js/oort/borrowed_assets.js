function getCollectibles() {
    const url = `https://api.thegraph.com/subgraphs/id/QmPhWfDpcuPHCSUw17cSNB1j5QUei1q6mGuu4kdQD36VZP`;
    axios.post(url, {
        timeout: 10000,
        query: `
      {
        erc721ForLends(where: {
          lender_not: "${EMPTY_ADDRESS}"
          borrower: "${parent.account}"
        }) {
          id
          durationHours
          initialWorth
          earningGoal
          borrowedAtTimestamp
          lender
          borrower
          lenderClaimedCollateral
          tokenAddress
          tokenId
        }
      }
    `,
    }).then(function (result) {
        if (result && result.status == 200) {
            let data = result.data.data;
            let erc721ForLends = data.erc721ForLends;
            if (erc721ForLends && erc721ForLends.length > 0) {
                collectibles = new Array();
                collectionsMap = new Map();
                let tokenIds = null;
                erc721ForLends.forEach(function (erc721ForLend) {
                    let collectibleBorrowed = new CollectibleBorrowed(null, erc721ForLend.tokenId, erc721ForLend.tokenAddress, null,
                        null, null, erc721ForLend.initialWorth, null,erc721ForLend.lender,erc721ForLend.borrower);
                    tokenIds = erc721ForLend.tokenId;
                    if (tokenIds != null) {
                        tokenIds += "&" + erc721ForLend.tokenId;
                    }
                    collectibles.push(collectibleBorrowed);
                    let collectionByAddr = collectionsMap.get(collectibleBorrowed.contractAddr);
                    if (collectionByAddr && collectionByAddr.size > 0) {
                        collectionByAddr.size++;
                    } else {
                        let collectionById = new Collection(collectibleBorrowed.contractAddr, collectibleBorrowed.name, 1);
                        collectionsMap.set(collectibleBorrowed.contractAddr, collectionById);
                    }
                });
                getCollectiblesInfo(collectibles, tokenIds);
            }
        }
    }).catch(function (error) {
        console.log(error)
    });
}

function getCollectiblesInfo(collectibles, tokenIds) {
    if (collectibles && collectibles.length > 0 && tokenIds && tokenIds.length > 0) {
        const url = getOpenSeaHostname + "/api/v1/assets/?token_ids=" + tokenIds;
        const data = null;
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
                let data = jQuery.parseJSON(this.responseText);
                let assets = data.assets;
                if (assets && assets.length > 0) {
                    assets.forEach(function (asset) {
                        let contract = asset.asset_contract;
                        let tokenId = asset.token_id;
                        collectibles.forEach(function (collectibleLend) {
                            if (collectibleLend.tokenId == tokenId) {
                                collectibleLend.id = asset.id.toString();
                                collectibleLend.name = contract.name;
                                collectibleLend.nftName = asset.name;
                                collectibleLend.smallImage = asset.image_thumbnail_url;
                                collectibleLend.bigImage = asset.image_url;
                                return;
                            }
                        })
                    })
                    showCollectibles(collectibles);
                    showCollections(collectible,collectionsMap);
                    $('#loading').loading("stop");
                    $('#div_main_collectibles').show();
                    getCollectionInfoFromLend721(collectibles);
                }
            }
        });

        xhr.open("GET", url);
        xhr.send(data);
    }
}