// eslint-disable-next-line no-undef
const Token = artifacts.require("Token");
// eslint-disable-next-line no-undef
const Exchange = artifacts.require("Exchange");

module.exports = async function(deployer) {
  // eslint-disable-next-line no-undef
  const accounts = await web3.eth.getAccounts(); // get the array of all accounts in Ganache
  
  const feeAccount = accounts[0];
  const feePercent = 10;

  await deployer.deploy(Token);
  await deployer.deploy(Exchange, feeAccount, feePercent);
};
