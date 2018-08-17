# library_system

This is an implementation of a library system.  The books of a library can be represented as a non-fungible asset, hence this uses the openzeppelin ERC-721 implentation as a baseline.  A book can be thought of as a token.

Assumption: Repair means the book can no longer be checked out.  Only librarians can enter books into repair states.  I leave condition/status up to individual users, but in a production envinroment there should be a gate for this (librarians or approved members update state on check_in).

## Setup

1. Install nodejs and rpm
2. Clone the project
3. Enter directory
4. Install dependencies by running npm install

## Tests
Execute `npm run test`.  This will launch truffle test which runs in truffle develop.  The tests are not all inclusive, but enough to demonstrate basic functionality.

`npm run start` will launch the truffle develop console.  Enter `truffle migrate --reset' to launch the test implementation.

## Information

* `Library.sol` extends from ERC721Token and represents the library.  The deployer of this contract is the 
library owner.

* `struct Book` is a proof of concept for the meta information associated with a book.  It should eventually follow the meta implementaiton defined by openzeppelin and be a URI identifier to somewhere on IPFS.
* `address[] user_history` records who has owned the book.  This is actual unnecessary as web3 front end could parse the events over time and an array can face growth issues.
* `bool[] repair_history` tracks repair states. Also unnecessary, but just for completeness.

* `mapping (address => bool) public staff` is those accounts who add books and checkout books.

* `enable_staff()` allows the owner to add staff

* `disable_staff()` allows the owner to remove staff

* `staff_status()` is a read-only function that gets staff state

* `add_book()` allows a staff member to add a book to the library (the owner's accounts)

* `check_out()` allows a staff member to check_out a book to any ethereum address

* `check_in()` allows any user to check in a book given the tokenId

* `view_book()` is convinence function to get a particular book's meta data.

* `get_index_number()` returns the total amount of books. (books are indexed/identified starting from 0)

* `transferFrom` overrides openzeppelins implementation to add a custom (struct) meta-data functionality.

All other openzeppenlin exposed functions are avaliable.
