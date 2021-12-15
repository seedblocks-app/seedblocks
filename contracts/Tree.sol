pragma solidity ^0.6.12;;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Tree is ERC721 {
   
  mapping(string => bool) public _isExists;
  mapping(uint => Tree) public _treeData;
  address private _owner;
  uint private _treeCount;

  /* baseURI for sending json metadata 
  */
  string private _baseURI;

   struct Tree {
        string name;
        string scientificName;
        string dateOfBirth;
        string country;
        string placeOfBirth;
        string placeOfResidence;
        string longitude;
        string latitude;
        string treeId;
        string url;
        string ImgURL;
    }

  constructor(string memory _URI) BEP721Full("SeedBlocks Forest", "SEED") public {
    _owner = ms.sender;
    _baseURI = _URI;
  }

  /**
    * @dev Returns the address of treedefi owner.
    */
  function getOwner() external view returns (address) {
        return _owner;
  }

  /**
     * @dev Returns an URI for a given token ID.
     * Throws if the token ID does not exist. May return an empty string.
     * @param tokenId uint256 ID of the token to query
     */
  function tokenURI(uint256 tokenId) external view returns (string memory) {
      require(
        _exists(tokenId),
        " BEP721Metadata: URI query for nonexistent token " 
      );

      string memory _id = toString(tokenId);
      
      string memory _tokenURI = concat(_baseURI, _id);       
        
      return _tokenURI;
  
  }

  /** 
    * @notice Change baseURI for tokenURI JSON metadata
    * @param _URI string baseURI to change
    */
  function setBaseURI(string memory _URI) public {
      require(
        msg.sender == _owner,
        " Treedefi: Only Owner can set baseURI "
      );

    _baseURI = _URI;

  }

  /** @dev Mint NFT and assign it to `owner`, increasing
     * the total supply.
     *@param _tree struct of value defining tree
     */
  function mint(Tree memory _tree) public { 

    require(
      msg.sender == _owner,
      " Treedefi: Only Owner can mint the tokens "
      );

    require(
      ! _isExists[_tree.treeId],
      " Treedefi: token with similar tree ID already exists "
      );  
    
    
    _treeCount++;

    _mint(msg.sender, _treeCount);
    
    _isExists[_tree.treeId] = true;

    _treeData[_treeCount] = _tree;

  }


/**
  * To String
  * 
  * Converts an unsigned integer to the ASCII string equivalent value
  * 
  * @param _base The unsigned integer to be converted to a string
  * @return string The resulting ASCII string value
  */
  function toString(uint _base)
        internal
        pure
        returns (string memory) {
        bytes memory _tmp = new bytes(32);
        uint i;
        for(i = 0;_base > 0;i++) {
            _tmp[i] = byte(uint8((_base % 10) + 48));
            _base /= 10;
        }
        bytes memory _real = new bytes(i--);
        for(uint j = 0; j < _real.length; j++) {
            _real[j] = _tmp[i--];
        }
        return string(_real);
    }


}