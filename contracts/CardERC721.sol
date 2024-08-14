// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Card
/// @notice This contract implements a customizable NFT for Greed Island
/// @dev Extends ERC721 and Ownable
contract Card is ERC721, Ownable {
    uint256 public nextTokenId;
    uint256 public constant MAX_TYPE = 999;
    mapping(uint256 => uint256) public allTokenIds;

    event NFTMinted(address indexed to, uint256 indexed tokenId, uint256 typeToken);

    error InvalidTokenType(uint256 typeToken);
    error TokenDoesNotExist(uint256 tokenId);

    /// @notice Initializes the NFT contract
    /// @dev Sets the name "GreedIsland" and symbol "TTS" for the NFT
    constructor() ERC721("GreedIsland", "CARD") Ownable(msg.sender) {
        nextTokenId = 1; // Start token IDs at 1
    }

    /// @notice Mints a new NFT
    /// @dev Increments the token ID, mints the token, and sets its type
    /// @param _tokenId The type of the token to be minted
    /// @return The ID of the newly minted token
    function mint(uint256 _tokenId) public payable returns (uint256) {
        if (_tokenId == 0 || _tokenId > MAX_TYPE) revert InvalidTokenType(_tokenId);

        uint256 newItemId = nextTokenId;
        _safeMint(msg.sender, newItemId);
        allTokenIds[newItemId] = _tokenId;

        emit NFTMinted(msg.sender, newItemId, _tokenId);

        nextTokenId++;
        return newItemId;
    }

    /// @notice Retrieves the type of a specific token
    /// @param _tokenId The ID of the token to query
    /// @return The type of the specified token
    function getTokenType(uint256 _tokenId) public view returns (uint256) {
        if (!_exists(_tokenId)) revert TokenDoesNotExist(_tokenId);
        return allTokenIds[_tokenId];
    }

    /// @notice Sets approval for an operator to manage all of the caller's tokens
    /// @param _operator The address to add to or remove from the set of authorized operators
    /// @param _approved True if the operator is approved, false to revoke approval
    function setApprovalForOperator(address _operator, bool _approved) public {
        setApprovalForAll(_operator, _approved);
    }

    /// @notice Allows the contract owner to set the next token ID
    /// @dev This can be useful for maintaining ID sequences or migrating from another contract
    /// @param _nextTokenId The next token ID to be used
    function setNextTokenId(uint256 _nextTokenId) public onlyOwner {
        nextTokenId = _nextTokenId;
    }

    /// @notice Checks if a token exists
    /// @dev This function replaces the _exists function from ERC721
    /// @param _tokenId The ID of the token to check
    /// @return bool indicating whether the token exists
    function _exists(uint256 _tokenId) internal view virtual returns (bool) {
        return _ownerOf(_tokenId) != address(0);
    }
}
