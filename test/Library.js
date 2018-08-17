var Library = artifacts.require("Library");

contract('Library-enable-disable unit tests', function(accounts) {
	it("Owner can add librarians", function() {
		Library.deployed().then(function(instance) {
			return instance.enable_staff(web3.eth.accounts[2]);
		}).then(function(result) {
			//Was a success
		}).catch(function(error) {
			assert.equal(true, false, "Adding librarian failed");
		});
	});
		
	it("Owner can remove librarians", function() {
		Library.deployed().then(function(instance) {
			return instance.disable_staff(web3.eth.accounts[2]);
		}).then(function(result) {
			//Was a success
		}).catch(function(error) {
			assert.equal(true, false, "Removing librarian failed");
		});
	});
	
	it("User cannot add librarians", function() {
		Library.deployed().then(function(instance) {
			return instance.enable_staff(web3.eth.accounts[2], {from: web3.eth.accounts[3]});
		}).then(function(result) {
			assert.equal(true, false, "User was able to addl iibrarian");
		}).catch(function(error) {
			//Was a success
		});
	});
});

contract('Library-staff-status unit test', async (accounts) => {
	it ("Staff status is updated", async () => {
		let instance = await Library.deployed();
		let staff_enable = await instance.enable_staff(web3.eth.accounts[3]);
		let staff_status = await instance.staff_status.call(web3.eth.accounts[3]);
		assert.equal(staff_status, true);
		
		let staff_disable = await instance.disable_staff(web3.eth.accounts[3]);
		staff_status = await instance.staff_status.call(web3.eth.accounts[3]);
		assert.equal(staff_status, false);
	})
});

contract('Book interaction tests', async (accounts) => {
	it("Only Librarians can add books [add_book]", async () => {
		let instance = await Library.deployed();
		let result = await instance.enable_staff(web3.eth.accounts[8]);	
		result =  instance.add_book("Book0", 6, {from: web3.eth.accounts[8], gas:3000000});		
		result =  instance.add_book("Book1", 6, {from: web3.eth.accounts[8], gas:3000000});
		result =  instance.add_book("Book2", 6, {from: web3.eth.accounts[8], gas:3000000});
		result =  instance.add_book("Book3", 6, {from: web3.eth.accounts[8], gas:3000000});
		result =  instance.add_book("Book4", 6, {from: web3.eth.accounts[8], gas:3000000});
		result =  instance.add_book("Book5", 6, {from: web3.eth.accounts[8], gas:3000000});
		try {
			result = await instance.add_book("Book6", 6, {from: web3.eth.accounts[4], gas:3000000});
			assert.equal(true, false, "Unauthroized user was able to add book");
		} catch (error) {
			//success
		}
	});

	it("Amount of books is correct [get_index-number]", async () => {
		let instance = await Library.deployed();
		let result = await instance.get_index_number.call();
		assert.equal(result.toNumber(), 6, "6 books not listed in library");
	});
	
	it("User can view books [view_book]", async () => {
		let instance = await Library.deployed();
		let result = await instance.view_book.call(3);
		assert.equal("Book3", result[0], "Book3 was not located at index 3");	
	});
	
	it("User cannot check out [check_out]", async () => {
		let instance = await Library.deployed();
		try {
		let result = await instance.check_out(
			web3.eth.accounts[6],
			3,
			{from: web3.eth.accounts[4], gas:3000000});
			
			assert.equal(true, false, "User should not be able to check out");
		} catch (error) {
			//success
		}
	});
	
	it("Librarian can check out book [check_out]", async () => {
		let instance = await Library.deployed();
		let result = await instance.enable_staff(web3.eth.accounts[4]);	
		result = await instance.check_out(
			web3.eth.accounts[6],
			3,
			{from: web3.eth.accounts[4], gas:3000000});		
	});
	
	it("Librarian can update repair state [change-repair_state]", async () => {
		let instance = await Library.deployed();
		let result = await instance.enable_staff(web3.eth.accounts[7]);
		result = await instance.change_repair_state(4, true, {from: web3.eth.accounts[7], gas:300000});
	});
	
	it("Librarian is blocked from checking outbook under repair", async () => {
		let instance = await Library.deployed();
		try {
			result = await instance.check_out(
				web3.eth.accounts[6],
				4,
				{from: web3.eth.accounts[7], gas:3000000});
				assert.equal(true, false, "Librarian should not be able to check out book in repair");
		} catch (error) {
			//success
		}
	});
	
	it("After repairing the Librarian can checkout the book", async () => {
		let instance = await Library.deployed();
		let result = await instance.change_repair_state(4, false, {from: web3.eth.accounts[7], gas:300000});
		try {
			result = await instance.check_out(
			web3.eth.accounts[6],
			4,
			{from: web3.eth.accounts[7], gas:3000000});
		} catch (error) {
			console.log(result);
			assert.equal(true, false, "Librarian should be able to check out book");
		}
	});
});

