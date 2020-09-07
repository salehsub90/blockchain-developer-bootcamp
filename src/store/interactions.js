import Web3 from 'web3';
import Token from '../abis/Token.json';
import {
  web3Loaded,
  web3AccountLoaded,
  TokenLoaded
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
    window.alert('Contract not deployed to te urrectnetwork Please select another network with MediaStreamTrackAudioSourceNode.');
    return null;
  }
}
