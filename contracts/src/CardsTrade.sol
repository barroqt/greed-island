// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract CardsTrade is Ownable, ERC721Holder, ReentrancyGuard {
    event TradeStatusChange(uint256 indexed tradeId, bytes32 status);
    event TradeCreated(uint256 indexed tradeId, address indexed seller, uint256 item, uint256 price);

    IERC20 public immutable jenisToken;
    IERC721 public immutable itemToken;

    enum TradeStatus {
        Open,
        Executed,
        Cancelled
    }

    struct Trade {
        address payable seller;
        uint256 item;
        uint256 price;
        TradeStatus status;
    }

    mapping(uint256 => Trade) public trades;

    uint256 public tradeCounter;

    error TradeNotOpen(uint256 tradeId);
    error EtherTransferFailed();
    error UnauthorizedCancellation();
    error InvalidPrice(uint256 price);
    error InsufficientAllowance(uint256 required, uint256 actual);
    error TokenTransferFailed();

    /// @notice Initializes the CardsTrade contract
    /// @param _jenisTokenAddress The address of the ERC20 token used for trades
    /// @param _itemTokenAddress The address of the ERC721 token being traded
    constructor(address _jenisTokenAddress, address _itemTokenAddress) Ownable(msg.sender) {
        jenisToken = IERC20(_jenisTokenAddress);
        itemToken = IERC721(_itemTokenAddress);
    }

    // ::::::::::::: TRADE ::::::::::::: //

    /// @notice Opens a new trade
    /// @param _item The ID of the item to be traded
    /// @param _price The price set for the item
    function openTrade(uint256 _item, uint256 _price) public nonReentrant {
        if (_price <= 0) revert InvalidPrice(_price);

        itemToken.safeTransferFrom(msg.sender, address(this), _item);

        trades[tradeCounter] =
            Trade({seller: payable(msg.sender), item: _item, price: _price, status: TradeStatus.Open});

        emit TradeCreated(tradeCounter, msg.sender, _item, _price);
        emit TradeStatusChange(tradeCounter, "Open");

        tradeCounter++;
    }

    /// @notice Executes an open trade
    /// @param _tradeId The ID of the trade to execute
    function executeTrade(uint256 _tradeId) public nonReentrant {
        Trade storage trade = trades[_tradeId];
        if (trade.status != TradeStatus.Open) revert TradeNotOpen(_tradeId);

        uint256 allowance = jenisToken.allowance(msg.sender, address(this));
        if (allowance < trade.price) revert InsufficientAllowance(trade.price, allowance);

        trade.status = TradeStatus.Executed;

        bool success = jenisToken.transferFrom(msg.sender, trade.seller, trade.price);
        if (!success) revert TokenTransferFailed();

        itemToken.safeTransferFrom(address(this), msg.sender, trade.item);

        emit TradeStatusChange(_tradeId, "Executed");
    }

    /// @notice Cancels an open trade
    /// @param _tradeId The ID of the trade to cancel
    function cancelTrade(uint256 _tradeId) public nonReentrant {
        Trade storage trade = trades[_tradeId];
        if (msg.sender != trade.seller) revert UnauthorizedCancellation();
        if (trade.status != TradeStatus.Open) revert TradeNotOpen(_tradeId);

        trade.status = TradeStatus.Cancelled;
        itemToken.safeTransferFrom(address(this), trade.seller, trade.item);

        emit TradeStatusChange(_tradeId, "Cancelled");
    }

    // ::::::::::::: GETTERS ::::::::::::: //

    /// @notice Retrieves the details of a specific trade
    /// @param _tradeId The ID of the trade to query
    /// @return seller The address of the seller
    /// @return item The ID of the item being sold
    /// @return price The price of the item
    /// @return status The current status of the trade
    function getTrade(uint256 _tradeId) public view returns (address, uint256, uint256, TradeStatus) {
        Trade storage trade = trades[_tradeId];
        return (trade.seller, trade.item, trade.price, trade.status);
    }
}
