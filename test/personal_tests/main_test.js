const artifacts = require('../build/contracts/Library.json')
const contract = require('truffle-contract')
const MyContract = contract(artifacts);
MyContract.setProvider(web3.currentProvider);


