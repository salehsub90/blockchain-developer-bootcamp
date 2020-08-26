import { ether, tokens, EVM_REVERT, ETHER_ADDRESS} from './helpers';

/* eslint-disable no-undef */
const Token = artifacts.require('./Token')
const Exchange = artifacts.require('./Exchange')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Exchange', ([deployer, feeAccount, user1, user2]) => {
  let token;
  let exchange;
  const feePercent = 10;

  beforeEach(async () => {
    //deploy token and exchange
    token = await Token.new();
    exchange = await Exchange.new(feeAccount, feePercent) // will be passed into the smart contract constructor
    
    //transfer some tokens to user1
    token.transfer(user1, tokens(100), { from: deployer })
  })

  describe('deployment', () => {
    it('tracks the fee account', async () => {
      const result = await exchange.feeAccount();
      result.should.equal(feeAccount)
    })
    
    it('tracks the fee percent', async () => {
      const result = await exchange.feePercent();
      result.toString().should.equal(feePercent.toString())
    })
  })

  describe('fallback', () => {
    it('reverts when Ether is sent', async () => {
      await exchange.sendTransaction({ value: 1, from: user1 }).should.be.rejectedWith(EVM_REVERT);
    })
  })

  describe('depositing Ether', async () => {
    let result;
    let amount;

    beforeEach(async () => {
      amount = ether(1);
      result = await exchange.depositEther({ from: user1, value: amount})
    })

    it('tracks the Ether deposit', async () => {
      const balance = await exchange.tokens(ETHER_ADDRESS, user1)
      balance.toString().should.equal(amount.toString());
    })

    it('emits a Deposit ether event', async () => {
      const log = result.logs[0];
      log.event.should.equal('Deposit');
      const event = log.args
      event.token.should.equal(ETHER_ADDRESS, 'ether address is correct');
      event.user.should.equal(user1, 'user address is correct');
      event.amount.toString().should.equal(amount.toString(), 'amount is correct');
      event.balance.toString().should.equal(amount.toString(), 'balance is correct');
    })   
  })

  describe('withdrawing Ether', async () => {
    let result;
    let amount;

    beforeEach(async () => {
      amount = ether(1);
      result = await exchange.depositEther({ from: user1, value: amount})
    })

    describe('success', async () => {
      beforeEach(async () => {
        //withdraw ether
        result = await exchange.withdrawEther(amount, { from: user1 })
      })

      it('withdraw ether funds', async () => {
        const balance = await exchange.tokens(ETHER_ADDRESS, user1)
        balance.toString().should.equal('0');
      }) 

      it('emits a Withdraw ether event', async () => {
        const log = result.logs[0];
        log.event.should.equal('Withdraw');
        const event = log.args
        event.token.should.equal(ETHER_ADDRESS, 'ether address is correct');
        event.user.should.equal(user1, 'user address is correct');
        event.amount.toString().should.equal(amount.toString(), 'amount is correct');
        event.balance.toString().should.equal('0', 'balance is correct');
      })       
    })

    describe('failure', async() => {
      it('rejects withdraws from insuffiecient balances', async () => {
        await exchange.withdrawEther(ether(100), {from: user1 }).should.be.rejectedWith(EVM_REVERT);
      })
    })
  })

  describe('depositing tokens', async () => {
    let result;
    let amount;

    describe('success', () => {
      beforeEach(async () => {
        amount = tokens(10);
        await token.approve(exchange.address, amount, { from: user1 })
        result = await exchange.depositToken(token.address, amount, { from: user1 })
      })

      it('tracks the token deposit', async () => {
        // check token balance
        let balance;
        balance = await token.balanceOf(exchange.address);
        balance.toString().should.equal(amount.toString());

        //check tokens on exchange
        balance = await exchange.tokens(token.address, user1);
        balance.toString().should.equal(amount.toString());
      })
      it('emits a Deposit token event', async () => {
        const log = result.logs[0];
        log.event.should.equal('Deposit');
        const event = log.args
        event.token.should.equal(token.address, 'token is correct');
        event.user.should.equal(user1, 'user address is correct');
        event.amount.toString().should.equal(amount.toString(), 'amount is correct');
        event.balance.toString().should.equal(amount.toString(), 'balance is correct');
      })                                                               
    })

    describe('failure', () => {
      it('rejects Ether deposits', async () => {
        await exchange.depositToken(ETHER_ADDRESS, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_REVERT);
      })

      it('fails when no tokens are approved', async () => {
        await exchange.depositToken(token.address, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_REVERT);
      })
    })
  })

  describe('withdrawing tokens', async () => {
    let result;
    let amount;

    describe('success', () => {
      beforeEach(async () => {
        amount = tokens(10);
        await token.approve(exchange.address, amount, { from: user1 })
        await exchange.depositToken(token.address, amount, { from: user1 })
        
        //withdraw the token
        result = await exchange.withdrawToken(token.address, amount, { from: user1 })
      })

      it('withdraws token funds', async () => {
        // check token balance
        let balance;
        
        //check tokens on exchange
        balance = await exchange.tokens(token.address, user1);
        balance.toString().should.equal('0');
      })
      it('emits a Withdraw token event', async () => {
        const log = result.logs[0];
        log.event.should.equal('Withdraw');
        const event = log.args
        event.token.should.equal(token.address, 'token is correct');
        event.user.should.equal(user1, 'user address is correct');
        event.amount.toString().should.equal(amount.toString(), 'amount is correct');
        event.balance.toString().should.equal('0', 'balance is correct');
      })                                                               
    })

    describe('failure', async() => {
      it('rejects ether withdraws', async () => {
        await exchange.withdrawToken(ETHER_ADDRESS, amount, { from: user1 }).should.be.rejectedWith(EVM_REVERT);
      })
      it('rejects withdraws from insuffiecient balances', async () => {
        await exchange.withdrawToken(token.address, tokens(1), {from: user1 }).should.be.rejectedWith(EVM_REVERT);
      })
    })
  })

  describe('checking balances', async () => {
    beforeEach(async () => {
      exchange.depositEther({ from: user1, value: ether(1) })
    })

    it('returns user balance', async () => {
      const result = await exchange.balanceOf(ETHER_ADDRESS, user1)
      result.toString().should.equal(ether(1).toString());
    })
  })

  describe('making orders', async () => {
    let result;

    beforeEach(async () => {
      result = await exchange.makeOrder(token.address, tokens(1), ETHER_ADDRESS, ether(1), { from: user1 })
    })

    it('tracks the newly created order', async () => {
      const orderCount = await exchange.orderCount()
      orderCount.toString().should.equal('1')
      const order = await exchange.orders('1')
      order.id.toString().should.equal(orderCount.toString(), 'id is correct')
      order.user.should.equal(user1, 'user is correct')
      order.tokenGet.should.equal(token.address, 'tokenGet is correct')
      order.amountGet.toString().should.equal(tokens(1).toString(), 'amountGet is correct')
      order.tokenGive.should.equal(ETHER_ADDRESS, 'tokenGive is correct')
      order.amountGive.toString().should.equal(ether(1).toString(), 'amountGive is correct')
      order.timestamp.toString().length.should.be.at.least(1, 'timestamp is correct')
    })

    it('emits an Order token event', async () => {
      const log = result.logs[0];
      log.event.should.equal('Order');
      const event = log.args
      event.id.toString().should.equal('1', 'id is correct')
      event.user.should.equal(user1, 'user is correct')
      event.tokenGet.should.equal(token.address, 'tokenGet is correct')
      event.amountGet.toString().should.equal(tokens(1).toString(), 'amountGet is correct')
      event.tokenGive.should.equal(ETHER_ADDRESS, 'tokenGive is correct')
      event.amountGive.toString().should.equal(ether(1).toString(), 'amountGive is correct')
      event.timestamp.toString().length.should.be.at.least(1, 'timestamp is correct')
    })     
  })

  describe('order actions', async () => {
    beforeEach(async () => {
      //user1 deposits ether only
      await exchange.depositEther({ from: user1, value: ether(1) })

      // give some token to user2
      await token.transfer(user2, tokens(100), { from: deployer });

      //user2 deposits token only
      await token.approve(exchange.address, token(2), { from: user2 })
      await exchange.depositToken(token.address, tokens(2), {from: user2 })

      //user1 makes an order to buy tokens with Ether
      await exchange.makeOrder(token.address, tokens(1), ETHER_ADDRESS, ether(1), { from: user1 })
    })

    describe('filling orders', async() => {
      let result;

      describe ('success', async() => {
        beforeEach(async () => {
          // user2 fills order
          result = await exchange.fillOrder('1', { from: user2 })
        })
        it('executes the trade & charges the fees', async () => {
          let balance;
          balance = await exchange.balanceOf(token.address, user1);
          balance.toString().should.equal(tokens(1).toString(), 'user1 received token');
          balance = await exchange.balanceOf(ETHER_ADDRESS, user2);
          balance.toString().should.equal(ether(1).toString(), 'user2 received Ether');
          balance = await exchange.balanceOf(ETHER_ADDRESS, user1)
          balance.tostring().should.equal('0', 'user1 Ether deducted')
          balance = await exchange.balanceOf(token.address, user2)
          balance.toString().should.equal(tokens(0.9).toString(), 'user2 tokens deducted with fee applied')
          const feeAccount = await exchange.feeAccount()
          balance = await exchange.balanceOf(token.address, feeAccount)
          balance.toString().should.equal(tokens(0.1).toString(), 'feeAccount received fee')
        })

      })
    })

    describe('cancelling orders', async () => {
      let result;
      describe('success', async () => {
        beforeEach(async () => {
          result = await exchange.cancelOrder('1', { from: user1 })
        })
        it('updates cancelled orders', async () => {
          const orderCancelled = await exchange.orderCancelled(1);
          orderCancelled.should.equal(true);
        })
        it('emits a Cancel token event', async () => {
          const log = result.logs[0];
          log.event.should.equal('Cancel');
          const event = log.args
          event.id.toString().should.equal('1', 'id is correct')
          event.user.should.equal(user1, 'user1 is correct')
          event.tokenGet.should.equal(token.address, 'tokenGet is correct')
          event.amountGet.toString().should.equal(tokens(1).toString(), 'amountGet is correct')
          event.tokenGive.should.equal(ETHER_ADDRESS, 'tokenGive is correct')
          event.amountGive.toString().should.equal(ether(1).toString(), 'amountGive is correct')
          event.timestamp.toString().length.should.be.at.least(1, 'timestamp is correct')
        })    
      })
      describe('failure', async () => {
        it('rejects an invalid order', async () => {
          const invalidOrderId = 9999;
          await exchange.cancelOrder(invalidOrderId, { from: user1 }).should.be.rejectedWith(EVM_REVERT);
        })
        it('rejects unauthorized cancelations', async () => {
          // cancel the order from another user
          await exchange.cancelOrder('1', { from: user2 }).should.be.rejectedWith(EVM_REVERT)
        })
      })
    })
  })
})