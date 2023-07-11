import {Pool} from "@aave/core-v3/dist/types/types";

const ethers = require('ethers')
const poolAbi = require('./../abis/PoolAbi.json')
const poolProviderAbi = require('./../abis/PoolDataProvider.json')
const liquidationContract = require("./../artifacts/contracts/LiquidationArb.sol/LiquidationArb.json");

const process = require("process");
const secrets = require('./../secrets.json');
import {BigNumber, Wallet} from "ethers";
import {UiPoolDataProviderV3} from "../typechain-types";
import {IUiPoolDataProviderV3} from "../typechain-types/@aave/periphery-v3/contracts/misc/UiPoolDataProviderV3";

// Config
const provider = new ethers.providers.InfuraProvider('mainnet', secrets.INFURA_KEY)
const wallet: Wallet = new Wallet(secrets.PRIVATE_KEY, provider);

// Contracts
const poolContract: Pool = new ethers.Contract('0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2', poolAbi.abi, provider)
const poolDataProviderContract: UiPoolDataProviderV3 = new ethers.Contract('0x91c0eA31b49B69Ea18607702c5d9aC360bf3dE7d', poolProviderAbi.abi, provider)

// Liquidation Constants
const DEFAULT_LIQUIDATION_CLOSE_FACTOR = 5000;
const MAX_LIQUIDATION_CLOSE_FACTOR = 10000;
const CLOSE_FACTOR_HF_THRESHOLD = 0.95;

export async function main() {
    await determineHFAndExecution('0xE11D09B92bE739cD9269b45e802e969a391073c7');
    poolContract.on('Borrow', async (reserve, user) => {
        console.log('Intercepted borrow')
        console.log('User: ' + user)
        await determineHFAndExecution(user);
    });

    poolContract.on('Supply', async (reserve, user) => {
        console.log('Intercepted supply')
        console.log('User: ' + user)
        await determineHFAndExecution(user);
    });

    console.log('Registered all')
}

async function determineHFAndExecution(userAddress: string) {
    // extract, convert, assert hf to be below zero
    try {
        const tx = await poolContract.getUserAccountData(userAddress);
        let userHF = ethers.utils.formatEther(tx.healthFactor);
        if (userHF < 1.0) {
            let closeFactor;
            if (CLOSE_FACTOR_HF_THRESHOLD > userHF) {
                closeFactor = MAX_LIQUIDATION_CLOSE_FACTOR
            } else if (CLOSE_FACTOR_HF_THRESHOLD < userHF) {
                closeFactor = DEFAULT_LIQUIDATION_CLOSE_FACTOR
            }

            const tx1: [IUiPoolDataProviderV3.UserReserveDataStructOutput[], number] = await poolDataProviderContract.getUserReservesData('0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e', userAddress);
            for (let i = 0; i < tx1.length; i++) {
                const singleAssetArray: IUiPoolDataProviderV3.UserReserveDataStructOutput[] | number = tx1[i];
                if (Array.isArray(singleAssetArray)) {
                    const underlyingAsset = singleAssetArray[0];
                    const usageAsCollateral = singleAssetArray[1];
                    const stableDebt: BigNumber = BigNumber.from(singleAssetArray[4]);
                    const variableDebt: BigNumber = BigNumber.from(singleAssetArray[5]);

                    if (usageAsCollateral) {
                        console.log(underlyingAsset)
                        if (BigNumber.from(0).lt(stableDebt) || BigNumber.from(0).lt(variableDebt)) {
                            const debtToCover: BigNumber = (stableDebt.add(variableDebt)).mul(BigNumber.from(closeFactor));

                        }
                    }
                }
            }

        }
    } catch (e) {
        console.error(e)
    }
}


function calculateProfitability () {

}

function executeLiquidation (gas) {

    // liquidationContract.
}


function calculateTransactionGasLimit () {

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});