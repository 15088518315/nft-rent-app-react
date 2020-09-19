
$("#div_metaMask").click(function () {
    ethereum.enable()
            .then(function (accounts) {
                if (ethereum.networkVersion != 4) {
                    alert("Please connect Metamask to the Rinkeby chain");
                } else {
                    init(accounts);
                    ethereum.on('accountsChanged', function (accounts) {
                        // Time to reload your interface with accounts[0]!
                        accountsChanged(accounts);
                    });
                    ethereum.on('chainChanged', function (accounts) {
                        chainChanged(accounts);
                    });
                }
            })
            .catch(function (error) {
                // Handle error. Likely the user rejected the login
                console.error(error);
            });
});

$("#btn_change_account").click(function () {
    $("#dialog_connect_wallet").modal("toggle");
});

function init(accounts) {
    account = accounts[0];
    var str = account.substring(0,6) + '...' + account.substring(account.length-4,account.length);
    $("#btn_connect_wallet").html(str);
    $("#font_account").html(str);
    $("#btn_connect_wallet").attr("data-target","#dialog_account");
    $("#ul_nav").show();
    $("#iframe").attr("src","../../html/oort/my_collectibles.html");
    initContracts();
}

function initContracts() {
    web3 = window.web3;
    $.getJSON("../../abi/lend721/lend721.json", function (data) {
        lend721Contract  = web3.eth.contract(data).at(lend721_contract_address);
    });
}

function accountsChanged(accounts) {
    account = accounts[0];
    var str = account.substring(0,6) + '...' + account.substring(account.length-4,account.length);
    $("#btn_connect_wallet").html(str);
    $("#font_account").html(str);
    if (ethereum.networkVersion == 1) {
        getCollectibles();
    }
}

function chainChanged(accounts) {
    alert('you are not in Rinkeby chain');
}


$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var id = $(this).attr('id');
    switch (id) {
        case 'collectibles':
            $("#iframe").attr("src",'../../html/oort/my_collectibles.html');
            break;
        case 'borrow_from_pool':
            $("#iframe").attr("src",'../../html/oort/borrow_from_pool.html');
            break;
        case 'borrowed_assets':
            $("#iframe").attr("src",'../../html/oort/borrowed_assets.html');
            break;

    }
})
