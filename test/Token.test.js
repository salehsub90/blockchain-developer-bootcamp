const { reverse } = require('lodash');

/* eslint-disable no-undef */
const Token = artifacts.require('./Token')

require('chai')
  .use(require('chai-as-promised'))
  .should()

  contract('Token', ([deployer, receiver]) => {
    const name = 'DApp Token';
    const symbol = 'DApp';
    const decimals = '18';
    const totalSupply = '1000000000000000000000000';
    let token;

    beforeEach(async () => {
      token = await Token.new()
    })

    describe('deployment', () => {
      it('tracks the name', async () => {
        // Fetch token from blockchanin
        // Read token name here...
        // The Token name is 'My Name'
        const result = await token.name();
        result.should.equal(name)
      })

      it('tracks the symbol', async () => {
        const result = await token.symbol();
        result.should.equal(symbol)
      })

      it('tracks the decimal', async () => {
        const result = await token.decimals();
        result.toString().should.equal(decimals)
      })

      it('tracks the total supply', async () => {
        const result = await token.totalSupply();
        result.toString().should.equal(totalSupply)
      })

      it('assigns total supply to the deployer', async () => {
        const result = await token.balanceOf(deployer);
        result.toString().should.equal(totalSupply)
      })
    })

    describe('sending tokens', () => {
      it('transfers token balances', async () => {
        let balanceOf
        // before transfer
        balanceOf = await token.balanceOf(deployer);
        console.log("deployer balance before transfer", balanceOf.toString());
        balanceOf = await token.balanceOf(receiver);
        console.log("receiver balance before trnasfer", balanceOf.toString());

        // transfer
        await token.transfer(receiver, '1000000000000000000', { from: deployer })

        // after transfer
        balanceOf = await token.balanceOf(deployer);
        console.log("deployer balance after transfer", balanceOf.toString());
        balanceOf = await token.balanceOf(receiver);
        console.log("receiver balance after trnasfer", balanceOf.toString());

      })
    })
})