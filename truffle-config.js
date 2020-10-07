require('babel-register');
require('babel-polyfill');
require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');
const privateKeys = [
  "fed3f0dad02d361c283430738face5c19fdfe6bfb7df61d40a7d81e06ba64b6c",
  "df3a781df22fde3901425398b39cab28e1c30abd30c8bd5632edd1ffe4c52574"
];
const INFURA_API_KEY = "e481184584ca4985a8bb96079d7c7320"; 
//const privateKeys = process.env.PRIVATE_KEYS || "";

module.exports = {
  networks: {
    // development: {
    //   host: "127.0.0.1",
    //   port: 7545,
    //   network_id: "*" // Match any network id
    // },
    kovan: {
      provider: function() {
        return new HDWalletProvider(
          privateKeys,
          `https://kovan.infura.io/v3/${INFURA_API_KEY}`
        )
      },
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 42
    }
  },
  contracts_directory: './src/contracts',
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
