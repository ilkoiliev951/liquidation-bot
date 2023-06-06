const ethers = require('ethers')

const poolAbi = require('./../abis/PoolAbi.json')
const liquidationContract = require("./../artifacts/contracts/LiquidationArb.sol/FlashLoan.json");

const process = require("process");
const secrets = require('./../secrets.json');

const provider = new ethers.providers.WebSocketProvider(`wss://eth-mainnet.g.alchemy.com/v2/BI6S9cHE37Gg9VPYPSlMtxH07mkd8nhe`)
const poolContract = new ethers.Contract('0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2', poolAbi.abi, provider)

async function main() {
    poolContract.on('Borrow', (eventName, event, user) => {
        let userAddress = JSON.stringify(user);
        determineHFAndExecution (userAddress);
    });

    poolContract.on('Supply', (eventName, event) => {
        let userAddress = JSON.stringify(user);
        determineHFAndExecution (userAddress);
    });

    poolContract.on('ReserveUsedAsCollateralEnabled', (eventName, event) => {
        console.log('ReserveUsedAsCollateralEnabled')
        let userAddress = JSON.stringify(user);
        determineHFAndExecution (userAddress);
    });

    poolContract.on('ReserveUsedAsCollateralDisabled', (eventName, event) => {
        console.log('ReserveUsedAsCollateralDisabled')
        let userAddress = JSON.stringify(user);
        determineHFAndExecution (userAddress);
    });

    poolContract.on('Repay', (eventName, event) => {
        console.log('Repay')
        let userAddress = JSON.stringify(user);
        determineHFAndExecution(userAddress);
    });

    poolContract.on('Withdraw', (eventName, event, user) => {
        console.log('Withdraw')
        let userAddress = JSON.stringify(user);
        determineHFAndExecution (userAddress);
    });
}

async function determineHFAndExecution (userAddress) {
    // extract, convert, assert hf to be below zero
    const tx =  await poolContract.getUserAccountData()

}

async function liquidate (collateralAsset, debtAsset, targetUser, debtToCover, receiveAToken) {


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