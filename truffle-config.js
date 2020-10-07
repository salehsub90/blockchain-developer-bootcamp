require('babel-register');
require('babel-polyfill');
require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider-privkey');
// const privateKeys = [
//   "2eaa8971f11064ee0c592100f93f7aaba20d2815be6ea33e90a533cdab7b0f7d",
//   "1f134d002e7ab0fd87bffe2be865adf4ccdafcf64bf01460bbcefafe21e97db2"
// ];
//const INFURA_API_KEY = "e481184584ca4985a8bb96079d7c7320"; 
const privateKeys = process.env.PRIVATE_KEYS || "";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider(
          privateKeys.split(','),
          `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`
        )
      },
      gas: 4712388,
      gasPrice: 25000000000,
      network_id: 42
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
