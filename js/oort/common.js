let collectibles;
let collectionsMap;

$(function () {
    $('#loading').loading("start");
    getCollectibles();
});

function getCollectionInfoFromLend721(collectibles) {
    collectibles.forEach(function (collectible) {
        parent.lend721Contract.lentERC721List(collectible.contractAddr, collectible.tokenId, function fun(error, data) {
            if (!error) {
                let durationHours = data[0];
                collectible.value = data[1];
                collectible.earningGoal = data[2];
                collectible.arp = collectible.earningGoal / collectible.value * (durationHours / 24 / 360);
                // console.log(data)
            } else {
                console.error(error);
            }
        });
    });
}

function getCollectionInfoFromNFTRent(collectibles) {
    collectibles.forEach(function (collectible) {
        parent.lend721Contract.getLessorList(collectible.tokenId, function fun(error, data) {
            if (!error) {
                let durationHours = data[0];
                let leasingTime = data[2];
                collectible.value = data[3];
                collectible.earningGoal = data[4];
                collectible.arp = collectible.earningGoal / collectible.value * (durationHours / 24 / 360);
                // console.log(data)
            } else {
                console.error(error);
            }
        });
    });
}

/**
 * show collectibles
 * @param collectibles
 */
function showCollectibles(collectibles) {
    if (collectibles && collectibles.length > 0) {
        let html = '';
        for (var i = 0; i < collectibles.length; i++) {
            if (i % 5 == 0) {
                html += '<div class="row mb-4 ml-3">';
            }
            let collection = collectibles[i];
            html += '        <div class="col-2">\n' +
                '                <div class="text-center pb-1" style="border: 1px solid black;border-radius: 8px">\n' +
                '                <div class="solid-dot ml-2 mt-2"></div>' +
                '                    <div><img class="rounded-circle border" src="' + collection.smallImage + '" width="50px"\n' +
                '                              height="50px"/></div>\n' +
                '                    <div class="mt-2 single-line">' + collection.name + '</div>\n' +
                '                    <div class="mt-2 font-weight-bold single-line">' + collection.nftName + '</div>\n' +
                '                    <div class="mt-2">#' + collection.tokenId + ' </div>\n' +
                '                    <div class="div-divider-0_1 mt-2"></div>\n' +
                '                    <div class="mt-2">Borrow</div>\n' +
                '                </div>\n' +
                '            </div>';
            if (i % 5 == 4 || i == collectibles.size - 1) {
                html += '</div>';
            }
        }
        $("#div_collectibles").html(html);
    }

}

/**
 * show all type of collection
 * @param collections
 * @param collectionsMap
 */
function showCollections(collections,collectionsMap) {
    if (collectionsMap && collectionsMap.size > 0) {
        let html = '';
        collectionsMap.forEach(function (value, key) {
            html += '<div><input type="checkbox" checked="checked" value="' + key + '"> ' + value.name + ' <span>{' + value.size + '}</span></div>';
        });
        $("#div_collections").html(html);
        //bind event
        $("#div_collections input[type='checkbox']").on('change', function () {
            let set = new Set();
            $('#div_collections input[type="checkbox"]:checked').each(
                function () {
                    let addr = $(this).val();
                    set.add(addr);
                }
            );
            if (set.size > 0) {
                let newCollectibles = new Array();
                collectibles.forEach(function (collection) {
                    if (set.has(collection.contractAddr)) {
                        newCollectibles.push(collection);
                    }
                });
                showCollectibles(newCollectibles);
            } else {
                showCollectibles(collections);
            }
        });
    }
}

$("a[class='dropdown-item']").click(function () {
    let nowCondition = $('#input_search').attr('condition');
    let condition = $(this).attr('id');
    if (nowCondition != condition) {
        $('#btn_filter').html($(this).html());
        $('#input_search').attr('condition', condition);
        order(condition);
    }
});

$('#input_search').keydown(function (e) {
    if (e.keyCode == 13) {
        //enter key
        let keyWord = $(this).val();
        search(SEARCH_CONDITION.COLLECTIBLE_NAME, keyWord);
    }
});

$('#input_search_collections').keydown(function (e) {
    if (e.keyCode == 13) {
        //enter key
        let keyWord = $(this).val();
        search(SEARCH_CONDITION.COLLECTION_NAME, keyWord);
    }
});

function search(condition, keyWord) {
    if (condition == SEARCH_CONDITION.COLLECTIBLE_NAME) {
        if (keyWord && keyWord.length > 0) {
            if (collectibles && collectibles.length > 0) {
                let newCollectibles = new Array();
                collectibles.forEach(function (collection) {
                    if (collection.nftName && collection.nftName.indexOf(keyWord) != -1) {
                        newCollectibles.push(collection);
                    }
                });
                if (newCollectibles.length > 0) {
                    showCollectibles(newCollectibles);
                }
            }
        } else {
            showCollectibles(collectibles);
        }
    } else if (condition == SEARCH_CONDITION.COLLECTION_NAME) {
        if (keyWord && keyWord.length > 0) {
            if (collectibles && collectibles.length > 0) {
                let newCollectionsMap = new Map();
                collectionsMap.forEach(function (value, key) {
                    if (value.name && value.name.indexOf(keyWord) != -1) {
                        newCollectionsMap.set(key,value);
                    }
                });
                if (newCollectionsMap.size > 0) {
                    showCollections(collectibles,newCollectionsMap);
                }
            }
        } else {
            showCollections(collectibles,collectionsMap);
        }
    }
}

function order(condition) {
    switch (condition) {
        case 'lowest_value':
            collectibles.sort(function (conectible1, conectible2) {
                if (conectible1.value > conectible2.value) return 1;
                if (conectible1.value > conectible2.value) return -1;
                return 0;
            });
            break;
        case 'highest_value':
            collectibles.sort(function (conectible1, conectible2) {
                if (conectible1.value > conectible2.value) return -1;
                if (conectible1.value > conectible2.value) return 1;
                return 0;
            });
            break;
        case 'lowest_arp':
            collectibles.sort(function (conectible1, conectible2) {
                if (conectible1.arp > conectible2.arp) return 1;
                if (conectible1.arp < conectible2.arp) return -1;
                return 0;
            });
            break;
        case 'highest_arp':
            collectibles.sort(function (conectible1, conectible2) {
                if (conectible1.arp > conectible2.arp) return -1;
                if (conectible1.arp < conectible2.arp) return 1;
                return 0;
            })
            break;
    }

    showCollectibles(collectibles);
}


