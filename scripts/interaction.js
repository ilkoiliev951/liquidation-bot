const ethers = require('ethers')

const poolAbi = require('./../abis/PoolAbi.json')
const poolProviderAbi = require('./../abis/PoolDataProvider.json')
const liquidationContract = require("./../artifacts/contracts/LiquidationArb.sol/FlashLoan.json");

const process = require("process");
const secrets = require('./../secrets.json');
const BigNumber = require('bignumber.js');

const provider = new ethers.providers.WebSocketProvider(`wss://eth-mainnet.g.alchemy.com/v2/BI6S9cHE37Gg9VPYPSlMtxH07mkd8nhe`)
const poolContract = new ethers.Contract('0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2', poolAbi.abi, provider)
const poolDataProviderContract = new ethers.Contract('0x91c0eA31b49B69Ea18607702c5d9aC360bf3dE7d', poolProviderAbi.abi, provider)

async function main() {
    poolContract.on('Borrow', (eventName, event, user) => {
        determineHFAndExecution(user);
    });

    poolContract.on('Supply', (eventName, event, user) => {
        determineHFAndExecution(user);
    });
}

async function determineHFAndExecution (userAddress) {
    // extract, convert, assert hf to be below zero
    try {
        const tx = await poolContract.getUserAccountData(userAddress)
        const userHF = convertHexToDec(tx.healthFactor.__hex)
        console.log(userAddress)
        console.log(userHF)
        if (userHF < 1.0) {
            //const tx = await poolDataProviderContract.getUserReservesData();
        }
    } catch (e) {
        console.error(e)
    }
}

async function liquidate (collateralAsset, debtAsset, targetUser, debtToCover, receiveAToken) {


}

function convertHexToDec (hexValue) {
    let num= new BigNumber(h2d(hexValue))
    let denom = new BigNumber(10).pow(16)
    return num.dividedBy(denom).toNumber()
}

function h2d(s) {
    function add(x, y) {
        var c = 0, r = [];
        var x = x.split('').map(Number);
        var y = y.split('').map(Number);
        while(x.length || y.length) {
            var s = (x.pop() || 0) + (y.pop() || 0) + c;
            r.unshift(s < 10 ? s : s - 10);
            c = s < 10 ? 0 : 1;
        }
        if(c) r.unshift(c);
        return r.join('');
    }

    var dec = '0';
    s.split('').forEach(function(chr) {
        var n = parseInt(chr, 16);
        for(var t = 8; t; t >>= 1) {
            dec = add(dec, dec);
            if(n & t) dec = add(dec, '1');
        }
    });
    return dec;
}

function getLiquidationContract() {
    return new ethers.Contract(
        secrets.ARB_CONTRACT_ADDRESS,
        liquidationContract.abi,
        getWallet()
    );
}

function getWallet () {
    return new ethers.Wallet(
        secrets.SEPOLIA_PRIVATE_KEY,
        provider
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});