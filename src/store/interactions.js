import Web3 from 'web3';
import Token from '../abis/Token.json';
import Exchange from '../abis/Exchange.json';
import {
  web3Loaded,
  web3AccountLoaded,
  TokenLoaded,
  ExchangeLoaded,
  cancelledOredersLoaded
} from './actions'

export const loadWeb3 = (dispatch) => {
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545')
  dispatch(web3Loaded(web3));  
  return web3
}

export const loadAccount = async (web3, dispatch) => {
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];
  dispatch(web3AccountLoaded(account));
  return account;
}

export const loadToken = async (web3, networkId, dispatch) => {
  try {
    const token = new web3.eth.Contract(Token.abi, Token.networks[networkId].address);
    dispatch(TokenLoaded(token));
    return token;
  } catch (err) {
    //console.log('Contract not deployed to the current network Please select another network with Metamask.');
    return null;
  }
}

export const loadExchange = async (web3, networkId, dispatch) => {
  try {
    const exchange = new web3.eth.Contract(Exchange.abi, Exchange.networks[networkId].address);
    dispatch(ExchangeLoaded(exchange));
    return exchange;
  } catch (err) {
    //console.log('Contract not deployed to the current network Please select another network with Metamask.');
    return null;
  }
}

export const loadAllOrders = async (exchange, dispatch) => {
  // fetch canceled orders with the "Cancel" event stream
  const cancelStream = await exchange.getPastEvents('Cancel', { fromBlock: 0, toBlock: 'latest' })
  // format the logged output
  const cancelledOreders = cancelStream.map((event) => event.returnValues)
  // add data cancelled order to the redux state/store
  dispatch(cancelledOredersLoaded(cancelledOreders));

  // fetch filled orders with "Trade" event stream

  // fetch all orders with the "Order" event stream

}
