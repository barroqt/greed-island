// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title JENIS
/// @notice ERC20 Token for Greed Island
/// @dev Extends ERC20 and Ownable
contract Jenis is ERC20, Ownable {
    uint8 private constant _DECIMALS = 18;
    uint256 private constant _INITIAL_SUPPLY = 1_000_000_000 * 10 ** 18; // 1 billion JENIS

    /// @notice Initializes the JENIS token
    /// @dev Mints the initial supply to the contract creator
    constructor() ERC20("JENIS", "JENIS") Ownable(msg.sender) {
        _mint(msg.sender, _INITIAL_SUPPLY);
    }

    /// @notice Returns the number of decimals used for token amounts
    function decimals() public pure override returns (uint8) {
        return _DECIMALS;
    }

    /// @notice Allows the owner to mint new tokens
    /// @param _to Address to receive the minted tokens
    /// @param _amount Amount of tokens to mint
    function mint(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
    }

    /// @notice Allows the owner to burn tokens from an address
    /// @param _from Address to burn tokens from
    /// @param _amount Amount of tokens to burn
    function burn(address _from, uint256 _amount) public onlyOwner {
        _burn(_from, _amount);
    }
}
