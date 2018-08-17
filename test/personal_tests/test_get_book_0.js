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
 
	console.log("getting book 0 data")
	contract.deployed()
		.then(function(instance) {
			return instance.view_book.call(0);
	}).then(function(count) {
		console.log("array size");
		console.log(String(count[0]));
		console.log("return item 2");
		console.log(count[1].toNumber());
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