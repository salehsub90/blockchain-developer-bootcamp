import { tokens, EVM_REVERT } from './helpers';
import { before } from 'lodash';

/* eslint-disable no-undef */
const Token = artifacts.require('./Token')

require('chai')
  .use(require('chai-as-promised'))
  .should()

  contract('Token', ([deployer, receiver, exchange]) => {
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

    describe('delegated token transfers', () => {
      let result;
      let amount;

      beforeEach(async () => {
        amount = tokens(100);
        await token.approve(exchange, amount, { from: deployer })
      })

      describe('success', async () => {
        beforeEach(async () => {
          result = await token.transferFrom(deployer, receiver, amount, { from: exchange })        
        })        
        it('transfers token balances', async () => {
          let balanceOf
          balanceOf = await token.balanceOf(deployer);
          balanceOf.toString().should.equal(tokens(999900).toString());
          balanceOf = await token.balanceOf(receiver);
          balanceOf.toString().should.equal(tokens(100).toString());
        })

        it('resets the allowance', async () => {
          const allowance = await token.allowance(deployer, exchange)
          allowance.toString().should.equal('0')
        })  
        it('emits a Transfer event', async () => {
          const log = result.logs[0];
          log.event.should.equal('Transfer');
          const event = log.args
          event.from.toString().should.equal(deployer, 'from is correct');
          event.to.toString().should.equal(receiver, 'to is correct');
          event.value.toString().should.equal(amount.toString(), 'value is correct');
        })
      })

      describe('failure', async () => {
        it('rejects insufficient balances for transfer only', async () => {
          let invalidAmount
          invalidAmount = tokens(100000000) // 100 million - greater than total supply
          await token.transfer(receiver, invalidAmount, { from: deployer }).should.be.rejectedWith(EVM_REVERT)
  
          // Attempt transfer tokens, when you have none
          //invalidAmount = tokens(10) // recipient has no tokens
          //console.log(receiver);
          //await token.transfer(deployer, invalidAmount, { from: receiver }).should.be.rejectedWith(EVM_REVERT)
        })

        it('rejects insufficient amounts for transferFrom', async () => {
          const invalidAmount = tokens(100000000)
          await token.transferFrom(deployer, receiver, invalidAmount, { from: exchange })
          .should.be.rejectedWith(EVM_REVERT);
        })

        it('rejects invalid recipients for transferFrom', async () => {
          await token.transferFrom(deployer, 0x0, amount, { from: exchange })
          .should.be.rejected
        })

        it('rejects invalid recipients for transfer only', async () => {
          await token.transfer(0x0, amount, { from: deployer }).should.be.rejected
        })
      })
    })

    describe('approving tokens', () => {
      let result;
      let amount;

      beforeEach(async () => {
        amount = tokens(100)
        result = await token.approve(exchange, amount, { from: deployer })
      })

      describe('success', () => {
        it('allocates an allowance for delegated token spending on an exchange', async () => {
          const allowance = await token.allowance(deployer, exchange)
          allowance.toString().should.equal(amount.toString())
        })

        it('emits an Approval event', async () => {
          const log = result.logs[0];
          log.event.should.equal('Approval');
          const event = log.args
          event.owner.should.equal(deployer, 'owner is correct');
          event.spender.should.equal(exchange, 'spender is correct');
          event.value.toString().should.equal(amount.toString(), 'value is correct');
          //console.log(result.logs);
        })
      })

      describe('failure', () => {
        it('rejects invalid spenders', async () => {
          await token.transfer(0x0, amount, { from: deployer }).should.be.rejected
        })
      })
    })
})