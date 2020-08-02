import { tokens, EVM_REVERT } from './helpers';

/* eslint-disable no-undef */
const Token = artifacts.require('./Token')

require('chai')
  .use(require('chai-as-promised'))
  .should()

  contract('Token', ([deployer, receiver]) => {
    const name = 'DApp Token';
    const symbol = 'DApp';
    const decimals = '18';
    const totalSupply = tokens(1000000).toString();
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
        result.toString().should.equal(totalSupply.toString())
      })

      it('assigns total supply to the deployer', async () => {
        const result = await token.balanceOf(deployer);
        result.toString().should.equal(totalSupply.toString())
      })
    })

    describe('sending tokens', () => {
      let result;
      let amount;

      beforeEach(async () => {
        amount = tokens(100);
        result = await token.transfer(receiver, amount, { from: deployer })        
      })

      describe('success', async () => {
        it('transfers token balances', async () => {
          let balanceOf
          // before transfer
          //balanceOf = await token.balanceOf(deployer);
          //console.log("deployer balance before transfer", balanceOf.toString());
          //balanceOf = await token.balanceOf(receiver);
          //console.log("receiver balance before trnasfer", balanceOf.toString());
  
          // transfer
          balanceOf = await token.balanceOf(deployer);
          balanceOf.toString().should.equal(tokens(999900).toString());
          balanceOf = await token.balanceOf(receiver);
          balanceOf.toString().should.equal(tokens(100).toString());
        })
  
        it('emits a transfer event', async () => {
          const log = result.logs[0];
          log.event.should.equal('Transfer');
          const event = log.args
          event.from.toString().should.equal(deployer, 'from is correct');
          event.to.toString().should.equal(receiver, 'to is correct');
          event.value.toString().should.equal(amount.toString(), 'value is correct');
          //console.log(result.logs);
        })
      })

      // need to test for failures inside of tests and
      // implement a failure check inside the transfer function

      describe('failure', async () => {
        it('rejects insufficient balances', async () => {
          let invalidAmount
          //invalidAmount = tokens(100000000) // 100 million - greater than total supply
          //console.log("receiver --  " + receiver);
          //console.log("deployer --  " + deployer);
          //await token.transfer(receiver, invalidAmount, { from: deployer }).should.be.rejectedWith(EVM_REVERT)
  
          // Attempt transfer tokens, when you have none
          invalidAmount = tokens(0) // recipient has no tokens
          console.log(receiver);
          await token.transfer(receiver, invalidAmount, { from: deployer }).should.be.rejectedWith(EVM_REVERT)
        })
        it('rejects invalid recipients', async () => {
          await token.transfer(0x0, amount, { from: deployer }).should.be.rejected
        })
      })
    })
})