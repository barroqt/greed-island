// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "forge-std/Script.sol";
import "../src/JenisERC20.sol";
import "../src/CardERC721.sol";
import "../src/CardsTrade.sol";

contract DeployContracts is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy JENIS Token
        Jenis jenisToken = new Jenis();
        console.log("JENIS Token deployed at:", address(jenisToken));

        // Deploy NFT Contract
        Card nftContract = new Card();
        console.log("NFT Contract deployed at:", address(nftContract));

        // Deploy Trade Contract
        CardsTrade tradeContract = new CardsTrade(address(jenisToken), address(nftContract));
        console.log("Trade Contract deployed at:", address(tradeContract));

        vm.stopBroadcast();
    }
}
