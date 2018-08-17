module.exports = function(callback) {
    let Web3 = require('web3');
  const truffleContract = require('truffle-contract')
  let contract = truffleContract(require('../build/contracts/Library.json'));
  var provider = new Web3.providers.HttpProvider("http://localhost:7545");
  var web3 = new Web3(provider);
  contract.defaults({
	  from: web3.eth.accounts[0]
  })
  contract.setProvider(web3.currentProvider);
  
	//The librarian is [2]
	var librarian = web3.eth.accounts[2];
	var transfee = web3.eth.accounts[3];
 
	console.log("Checking out book 1 from librarian 2 to user 3");
	contract.deployed()
		.then(function(instance) {
			return instance.check_out(transfee, 1, {from:librarian, gas:3000000});
	}).then(function(result) {
		console.log(result);
	}).catch(function(error) {
		console.error(error)
	})
		
	
contract.deployed()
.then(function(instance) {
  console.log(instance.address)
})
.catch(function(error) {
  console.error(error)
})

}