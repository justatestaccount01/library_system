pragma solidity ^0.4.24; 
import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

/*
* The Library system is using the openzeppelin ERC721 token as a starting point.
* In production, the ERC721 baseline should be forked and then unwanted features 
* removed.
*/
contract Library is ERC721Token { 
    /* We will override the 'meta' NFT part of
     * of the frame work and use a simple struct
     * for proof of concept. In reality this 
     * information should be in JSON format
     * stored on IPFS.  This means we will need 
     * to override some of the openz functionality.
    */
    struct Book {
        //Condition expressed from 1 to 10
        string book_name;
        uint8 condition;
        address[] user_history;
        bool[] repair_history;
    }

    address public lib_owner;
    mapping (address => bool) public staff;
    uint256 internal token_id_pool = 0;
    // Mapping for token URIs
    mapping(uint256 => Book) internal token_meta_data;

    /* We will override the 'meta' NFT part of
     * of the frame work and use a simple struct
     * for proof of concept. In reality this 
     * information should be in JSON format
     * stored on IPFS
    */

    event staff_update(
        address indexed _staff,
        bool indexed _status 
    );

    event book_added(
        address indexed _from,
        uint256 indexed _token_id 
    );

    event book_checked_out(
        address indexed _to,
        uint256 indexed _token_id
    );

    event book_checked_in(
        address indexed _from,
        uint256 indexed _token_id
    );

    modifier hasStaffPermission() {
        require(msg.sender == lib_owner);
        _;
    }

    modifier isStaff() {
        require(staff[msg.sender] == true);
        _;
    }

    constructor() ERC721Token("Library", "My Library") public {
        lib_owner = msg.sender;
    }

    function enable_staff(address _address)
        external
        hasStaffPermission
    {
        //Don't update if already set
        require(staff[_address] != true);
        staff[_address] = true;
        setApprovalForAll(_address, true);
        emit staff_update(_address, true);
    }

    function disable_staff(address _address)
        external
        hasStaffPermission
    {
        require(staff[_address] == true);
        staff[_address] = false;
        setApprovalForAll(_address, false);
        emit staff_update(_address, false);
    }

    function staff_status(address _address) public view returns (bool _status) {
        return staff[_address];
    }

    //TODO: should check condition is within bounds (1-10)
    function add_book(string _book_name, uint8 _condition) 
        external
        isStaff 
        returns (uint256 id) 
    {
        super._mint(lib_owner, token_id_pool);
        uint256 item_id = token_id_pool;
        token_id_pool++;
        token_meta_data[item_id] = Book({
            book_name: _book_name,
            condition: _condition,
            user_history: new address[](0),
            repair_history: new bool[](0)
        });
        token_meta_data[item_id].user_history.push(lib_owner);
        token_meta_data[item_id].repair_history.push(false);
        emit book_added(msg.sender, item_id);
        return item_id;
    }

    function check_out(address _to, uint256 _tokenId) 
        public
        isStaff
    {
        //Check if book exists
        require(exists(_tokenId));
        //Check owner is library
        require(ownerOf(_tokenId) == lib_owner);
        transferFrom(lib_owner, _to, _tokenId);
        emit book_checked_out(_to, _tokenId);
    }

    function check_in(uint256 _tokenId, bool _repair, uint8 _condition) public {
        require(exists(_tokenId));
        require(ownerOf(_tokenId) == msg.sender);
        token_meta_data[_tokenId].condition = _condition;
        token_meta_data[_tokenId].user_history.push(lib_owner);
        token_meta_data[_tokenId].repair_history.push(_repair);
        transferFrom(msg.sender, lib_owner, _tokenId);
        emit book_checked_in(msg.sender, _tokenId);
    }

    function view_book(uint256 _tokenId) public view returns(
        string book_name,
        uint8 condition,
        address[] user_history,
        bool[] repair_history,
        address owner_of
    ) {
        require(exists(_tokenId));
        owner_of = ownerOf(_tokenId);
        book_name = token_meta_data[_tokenId].book_name;
        condition = token_meta_data[_tokenId].condition;
        user_history = token_meta_data[_tokenId].user_history;
        repair_history = token_meta_data[_tokenId].repair_history;
      }

    function get_index_number() public view returns(uint256 id) {
        return token_id_pool;
    }

    /*
    * Override of transferFrom to update Book's meta data
    */
    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
     )
        public
    {
        super.transferFrom(_from, _to, _tokenId);
        token_meta_data[_tokenId].user_history.push(_to);
    }
}
