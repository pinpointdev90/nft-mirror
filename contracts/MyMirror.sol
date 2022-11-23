//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyMirror is IERC721, IERC721Metadata, ERC165, Ownable {
    using Strings for uint256;

    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;

    // Mapping owner address to token count
    mapping(address => uint256) private _balances;

    // Struct for updating the owners
    struct OwnerUpdate {
        address owner;
        uint256[] tokenIds;
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC165, IERC165)
        returns (bool)
    {
        return
            interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IERC721Metadata).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
     * @dev See {IERC721Metadata-name}.
     */
    function name() public pure returns (string memory) {
        return "MyNFT";
    }

    /**
     * @dev See {IERC721Metadata-symbol}.
     */
    function symbol() public pure returns (string memory) {
        return "MNFT";
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) external pure returns (string memory) {
        return
            string(abi.encodePacked("http://mynft.com/", tokenId.toString()));
    }

    /**
     * @dev See {IERC721-balanceOf}.
     */
    function balanceOf(address owner) public view virtual returns (uint256) {
        require(
            owner != address(0),
            "ERC721: balance query for the zero address"
        );
        return _balances[owner];
    }

    /**
     * @dev See {IERC721-ownerOf}.
     */
    function ownerOf(uint256 tokenId) public view virtual returns (address) {
        address owner = _owners[tokenId];
        require(
            owner != address(0),
            "ERC721: owner query for nonexistent token"
        );
        return owner;
    }

    /**
     * @dev See {IERC721-approve}.
     */
    function approve(address, uint256) public {
        // INFO: disabled
    }

    /**
     * @dev See {IERC721-getApproved}.
     */
    function getApproved(uint256) public view returns (address) {
        // INFO: disabled
    }

    /**
     * @dev See {IERC721-setApprovalForAll}.
     */
    function setApprovalForAll(address, bool) public {
        // INFO: disabled
    }

    /**
     * @dev See {IERC721-isApprovedForAll}.
     */
    function isApprovedForAll(address, address) public pure returns (bool) {
        // INFO: disabled
        return false;
    }

    /**
     * @dev See {IERC721-transferFrom}.
     */
    function transferFrom(
        address,
        address,
        uint256
    ) public {
        // INFO: disabled
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(
        address,
        address,
        uint256
    ) public {
        // INFO: disabled
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(
        address,
        address,
        uint256,
        bytes memory
    ) public {
        // INFO: disabled
    }

    function setOwners(OwnerUpdate[] calldata _ownerUpdates) public onlyOwner {
        // For each of the owner updates
        for (uint256 i = 0; i < _ownerUpdates.length; i++) {
            address owner = _ownerUpdates[i].owner;
            uint256[] calldata tokenIds = _ownerUpdates[i].tokenIds;

            // Reset the balance of the owner
            delete _balances[owner];

            // For each of the token ids
            for (uint256 k = 0; k < tokenIds.length; k++) {
                address previousOwner = _owners[tokenIds[k]];

                // Reset the balances of the previous owner
                delete _balances[previousOwner];

                // Reset the owner of the token ids
                delete _owners[tokenIds[k]];
            }
        }

        // For each of the owner updates
        for (uint256 k = 0; k < _ownerUpdates.length; k++) {
            address owner = _ownerUpdates[k].owner;
            uint256[] calldata tokenIds = _ownerUpdates[k].tokenIds;

            // Set the balances of the owner
            _balances[owner] = tokenIds.length;

            for (uint256 l = 0; l < tokenIds.length; l++) {
                // Set the owner of the token ids
                _owners[tokenIds[l]] = owner;
            }
        }
    }
}
