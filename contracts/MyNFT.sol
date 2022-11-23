//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyNFT is ERC721 {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdTracker;

    constructor() ERC721("MyNFT", "MNFT") {
    }

    function _baseURI() override internal pure returns (string memory) {
        return "http://mynft.com/";
    }

    function mint() external {
        _mint(msg.sender, _tokenIdTracker.current());
        _tokenIdTracker.increment();
    }
}