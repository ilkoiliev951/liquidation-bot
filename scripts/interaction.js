const ethers = require('ethers')

const poolAbi = require('./../abis/PoolAbi.json')
const process = require("process");

const provider = new ethers.providers.WebSocketProvider(`wss://eth-mainnet.g.alchemy.com/v2/BI6S9cHE37Gg9VPYPSlMtxH07mkd8nhe`)

async function main() {
    const poolContract = new ethers.Contract('0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2', poolAbi.abi, provider)

    const tx =  await poolContract.getUserAccountData('0xd97bC5744409be075C4FeDF285EEc3B1A557325e')
    console.log(tx)

    poolContract.on('Borrow', (eventName, event, user) => {
        console.log('Borrow');
        console.log(JSON.stringify(event))
        console.log(JSON.stringify(user))

    });

    poolContract.on('Supply', (eventName, event) => {
        console.log('Supply');
        console.log(JSON.stringify(event))
    });

    poolContract.on('ReserveDataUpdated', (eventName, event) => {
        console.log('ReserveDataUpdated');
        console.log(JSON.stringify(event))
    });

    poolContract.on('ReserveUsedAsCollateralEnabled', (eventName, event) => {
        console.log('ReserveUsedAsCollateralEnabled')
        console.log(JSON.stringify(event))
    });

    poolContract.on('ReserveUsedAsCollateralDisabled', (eventName, event) => {
        console.log('ReserveUsedAsCollateralDisabled')
        console.log(JSON.stringify(event))
    });

    poolContract.on('Repay', (eventName, event) => {
        console.log('Repay')
        console.log(JSON.stringify(event))
    });

    poolContract.on('Withdraw', (eventName, event, user) => {
        console.log('Withdraw')
        console.log('User is: ' + JSON.stringify(event))

    });
}

async function HFBelowZero () {

    // extract, convert, assert

}



main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});