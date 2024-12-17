require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();
const privateKeys = process.env.PRIVATE_KEYS || '';

// task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(accounts.address);
//   }
// });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.19',
  networks: {
    localhost: {},
    sepolia: {
      url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: privateKeys.split(','),
    },
  },
  formatter: {
    enabled: true,
    formatters: {
      js: {
        command: 'prettier --write',
        extensions: ['.js', '.ts'],
      },
      sol: {
        command: 'prettier --write',
        extensions: ['.sol'],
      },
    },
  },
};
