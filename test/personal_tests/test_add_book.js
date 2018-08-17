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
  
  //add a librarian
 

		
	console.log("adding a book")
	//add a book 1
	contract.deployed()
		.then(function(instance) {
			return instance.add_book("River Runs", 6, {from: web3.eth.accounts[0], gas:3000000});
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