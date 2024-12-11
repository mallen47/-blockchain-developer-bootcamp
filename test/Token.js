// const { expect } = require('chai');
var should = require('chai').should();
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');
};

describe('Token', () => {
  let token, accounts, deployer;

  beforeEach(async () => {
    const Token = await ethers.getContractFactory('Token');
    token = await Token.deploy('Moon Lambo', 'MNB', '1000000');
    accounts = await ethers.getSigners();
    deployer = accounts[0];
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
});
