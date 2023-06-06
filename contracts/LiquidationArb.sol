pragma solidity 0.8.10;

import {FlashLoanSimpleReceiverBase} from "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IERC20} from "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol";
import {Pool} from "@aave/core-v3/contracts/protocol/pool/Pool.sol";

contract FlashLoan is FlashLoanSimpleReceiverBase {
    address payable owner;
    Pool private lendingPool;
    address private constant LENDING_POOL_ADDRESS = 0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2;


    constructor() FlashLoanSimpleReceiverBase(IPoolAddressesProvider(LENDING_POOL_ADDRESS)) {
        owner = payable(msg.sender);
        lendingPool = new Pool(IPoolAddressesProvider(LENDING_POOL_ADDRESS));
    }

    /**
        This function is called after your contract has received the flash loaned amount
     */
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        (address targetUser, address debtAsset, address collateralAsset, uint256 debtToCover, bool receiveAToken) = abi.decode(params, (address, address,address, uint256, bool));

        lendingPool.liquidationCall(collateralAsset, debtAsset, targetUser, debtToCover, receiveAToken);

        uint256 amountOwed = amount + premium;
        IERC20(asset).approve(address(POOL), amountOwed);

        return true;
    }

    function requestFlashLoan(address _token, uint256 _amount, address targetUser, address debtAsset, address collateralAsset, uint256 debtToCover, bool receiveAToken) public onlyOwner{
        address receiverAddress = address(this);
        address asset = _token;
        uint256 amount = _amount;
        bytes memory params = abi.encode(targetUser, debtAsset, collateralAsset, debtToCover, receiveAToken);
        uint16 referralCode = 0;

        POOL.flashLoanSimple(
            receiverAddress,
            asset,
            amount,
            params,
            referralCode
        );
    }

    function withdraw(address _tokenAddress) external onlyOwner {
        IERC20 token = IERC20(_tokenAddress);
        token.transfer(msg.sender, token.balanceOf(address(this)));
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function"
        );
        _;
    }

    receive() external payable {}
}