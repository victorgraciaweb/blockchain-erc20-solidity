const customERC20 = artifacts.require("customERC20");

contract("customERC20", accounts => {
    console.log("Accounts: ", accounts);

    it("create tokens", async () => {
        let instance = await customERC20.deployed();

        let tokens = 1000;

        let _initial_supply = await instance.totalSupply();
        assert.equal(_initial_supply, 0);

        await instance.crearTokens();

        let _after_supply = await instance.totalSupply();
        assert.equal(_after_supply, tokens);

        let _balance = await instance.balanceOf(accounts[0]);
        assert.equal(_balance, tokens);
    });

    it("Destroy tokens", async () => {
        let instance = await customERC20.deployed();

        let _total_balance = await instance.balanceOf(accounts[0]);

        await instance.destruirTokens(accounts[0], _total_balance);

        let _total_balance2 = await instance.balanceOf(accounts[0]);
        assert.equal(_total_balance2, 0);
    });

    it("name", async () => {
        let instance = await customERC20.deployed();

        let _name = await instance.name.call();
        assert.equal(_name, "Victor");
    });

    it("symbol", async () => {
        let instance = await customERC20.deployed();

        let _symbol = await instance.symbol.call();
        assert.equal(_symbol, "VIC");
    });

    it("decimals", async () => {
        let instance = await customERC20.deployed();

        let _decimals = await instance.decimals.call();
        assert.equal(_decimals, 18);
    });

    it("transfer tokens", async () => {
        let instance = await customERC20.deployed();

        let tokens = 200;

        await instance.crearTokens();

        await instance.transfer(accounts[1], tokens, {from: accounts[0]});

        let _balance_account_sender = await instance.balanceOf(accounts[0]);
        assert.equal(_balance_account_sender, 1000 - tokens);
    });

    it("approve, allowance & transferFrom", async () => {
        let instance = await customERC20.deployed();

        let tokens_allowance = 300;

        let _initial_allowance = await instance.allowance(accounts[0], accounts[1]);
        assert.equal(_initial_allowance, 0);

        await instance.approve(accounts[1], tokens_allowance, {from: accounts[0]});

        let _after_allowance = await instance.allowance(accounts[0], accounts[1]);
        assert.equal(_after_allowance, tokens_allowance);

        await instance.transferFrom(accounts[0], accounts[2], 20, {from: accounts[1]})

        let _after_allowance_done = await instance.allowance(accounts[0], accounts[1]);
        assert.equal(_after_allowance_done, tokens_allowance - 20);

        let _balance_account_owner = await instance.balanceOf(accounts[0]);
        assert.equal(_balance_account_owner, 780);

        let _balance_account_receiver = await instance.balanceOf(accounts[2]);
        assert.equal(_balance_account_receiver, 20);
    });

    it("increaseAllowance & decreaseAllowance", async() => {
        let instance = await customERC20.deployed();

        let _initial_allowance = await instance.allowance(accounts[0], accounts[3]);
        assert.equal(_initial_allowance, 0);

        await instance.increaseAllowance(accounts[3], 50, {from: accounts[0]});

        let _after_allowance = await instance.allowance(accounts[0], accounts[3]);
        assert.equal(_after_allowance, 50);

        await instance.decreaseAllowance(accounts[3], 20, {from: accounts[0]});

        let _final_allowance = await instance.allowance(accounts[0], accounts[3]);
        assert.equal(_final_allowance, 30);
    });
})