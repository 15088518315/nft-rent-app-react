var lend721Contract;
var web3;
var account;

const isProduction = false;
const lend721_contract_address = `${isProduction ? '0xA133541435cAeB964f572132acd8FEAC3Ed1D80B' : '0x1762fd547d6C286a174dD62b6A6fACFAc064A0A0'}`;
const getOpenSeaHostname = `https://${isProduction ? '' : 'rinkeby-'}api.opensea.io`;
const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';

//the type of collateralized
var COLLATERALIZED_TYPE = {
    UNDER_COLLATERALIZED : "undercollateralized",
    OVER_COLLATERALIZED : "overcollateralized"
};

//the type of search condition_
var SEARCH_CONDITION = {
    COLLECTION_NAME : "collection_name",
    COLLECTIBLE_NAME : "collectible_name"
};


/**
 * collectible is a nft
 */
class Collectible {
    constructor(id, tokenId, contractAddr, name, nftName, smallImage, bigImage) {
        this._id = id;
        this._tokenId = tokenId;
        this._name = name;
        this._contractAddr = contractAddr;
        this._nftName = nftName;
        this._smallImage = smallImage;
        this._bigImage = bigImage;
    };

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get tokenId() {
        return this._tokenId;
    }

    set tokenId(value) {
        this._tokenId = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get nftName() {
        return this._nftName;
    }

    set nftName(value) {
        this._nftName = value;
    }

    get smallImage() {
        return this._smallImage;
    }

    set smallImage(value) {
        this._smallImage = value;
    }

    get bigImage() {
        return this._bigImage;
    }

    set bigImage(value) {
        this._bigImage = value;
    }

    get contractAddr() {
        return this._contractAddr;
    }

    set contractAddr(value) {
        this._contractAddr = value;
    }
}

/**
 * collection is a nft contract(or a nft project)
 */
class Collection {
    constructor(contractAddr, name, size) {
        this._size = size;
        this._contractAddr = contractAddr;
        this._name = name;
    };


    get contractAddr() {
        return this._contractAddr;
    }

    set contractAddr(value) {
        this._contractAddr = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get size() {
        return this._size;
    }

    set size(value) {
        this._size = value;
    }
}

/**
 * the collectible to borrow
 */
class CollectibleToBorrow extends Collectible {
    constructor(id, tokenId, name, nftName, smallImage, bigImage, value, earningGoal, arp) {
        super(id, tokenId, name, nftName, smallImage, bigImage);
        this._value = value;
        this._earningGoal = earningGoal;
        this._arp = arp;
    };

    get lender() {
        return this._lender;
    }

    set lender(value) {
        this._lender = value;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }


    get earningGoal() {
        return this._earningGoal;
    }

    set earningGoal(value) {
        this._earningGoal = value;
    }


    get arp() {
        return this._arp;
    }

    set arp(value) {
        this._arp = value;
    }

}

/**
 * collectible has borrowed
 */
class CollectibleBorrowed extends CollectibleToBorrow {
    constructor(id, tokenId, name, nftName, smallImage, bigImage, value, earningGoal,
                arp, collateralizedType,lender,borrower) {
        super(id, tokenId, name, nftName, smallImage, bigImage,value,earningGoal,arp,collateralizedType);
        this._lender = lender;
        this._borrower = borrower;
    };


    get lender() {
        return this._lender;
    }

    set lender(value) {
        this._lender = value;
    }

    get borrower() {
        return this._borrower;
    }

    set borrower(value) {
        this._borrower = value;
    }
}