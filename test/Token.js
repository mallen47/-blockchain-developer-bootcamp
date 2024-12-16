// const { expect } = require('chai');
// var expect = require('chai').expect;
require('chai').should();
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');
};

describe('Token', () => {
  let token, accounts, deployer, receiver, exchange;

  beforeEach(async () => {
    const Token = await ethers.getContractFactory('Token');
    token = await Token.deploy('Moon Lambo', 'MNB', '1000000');
    accounts = await ethers.getSigners();
    deployer = accounts[0];
    receiver = accounts[1];
    exchange = accounts[2];
  });

  describe('Deployment', () => {
    const name = 'Moon Lambo';
    const symbol = 'MNB';
    const decimals = '18';
    const totalSupply = tokens('1000000');

    it('has the expected name', async () => {
      (await token.name()).should.equal(name);
    });

    it('has the expected symbol', async () => {
      (await token.symbol()).should.equal(symbol);
    });

    it('has the expected number of decimals', async () => {
      (await token.decimals()).should.equal(decimals);
    });

    it('has the expected total supply', async () => {
      (await token.totalSupply()).should.equal(totalSupply);
    });

    it('assigns total supply to the deployer', async () => {
      (await token.balanceOf(deployer.address)).should.equal(totalSupply);
    });
  });

  describe('Sending Tokens', () => {
    let amount, transaction, result;

    beforeEach(async () => {
      amount = tokens(100);
      transaction = await token.connect(deployer).transfer(receiver.address, amount);
      result = await transaction.wait();
    });

    describe('Positive Cases', () => {
      it('transfers token balances', async () => {
        (await token.balanceOf(deployer.address)).should.equal(tokens(999900));
        (await token.balanceOf(receiver.address)).should.equal(amount);
      });

      it('emits a Transfer event', async () => {
        const event = result.events[0];
        event.event.should.equal('Transfer');

        const args = event.args;
        args.from.should.equal(deployer.address);
        args.to.should.equal(receiver.address);
        args.value.should.equal(amount);
      });
    });

    describe('Negative Cases', () => {
      it('rejects insufficient balances', async () => {
        const invalidAmount = tokens(100000000);
        await token.connect(deployer).transfer(receiver.address, invalidAmount).should.be.reverted;
      });

      it('rejects invalid recipient', async () => {
        const amount = tokens(100);
        await token.connect(deployer).transfer('0x0000000000000000000000000000000000000000', amount).should.be.reverted;
      });
    });
  });

  describe('Approving Tokens', () => {
    let amount, transaction, result;

    beforeEach(async () => {
      amount = tokens(100);
      transaction = await token.connect(deployer).approve(exchange.address, amount);
      result = await transaction.wait();
    });

    describe('Positive Cases', () => {
      it('allocates an allowance for delegated token spending', async () => {
        let allowance = await token.allowance(deployer.address, exchange.address);
        allowance.toString().should.equal(amount.toString());
      });

      it('emits an Approval event', async () => {
        const event = result.events[0];
        event.event.should.equal('Approval');

        const args = event.args;
        args.owner.should.equal(deployer.address);
        args.spender.should.equal(exchange.address);
        args.value.should.equal(amount);
      });
    });

    describe('Negative Cases', () => {
      it('rejects invalid spenders', async () => {
        await token.connect(deployer).approve('0x0000000000000000000000000000000000000000', amount).should.be.reverted;
      });
    });
  });
});
