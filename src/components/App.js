/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import Navbar from './Navbar';
import Content from './Content';
import { 
  loadWeb3, 
  loadAccount, 
  loadToken, 
  loadExchange 
} from '../store/interactions';

class App extends Component {
  componentWillMount() {
    this.loadBlockChainData(this.props.dispatch);
  }

  async loadBlockChainData(dispatch) {
    const web3 = loadWeb3(dispatch);
    const network = await web3.eth.net.getNetworkType();
    const networkId = await web3.eth.net.getId();
    const accounts = await loadAccount(web3, dispatch);
    const token = loadToken(web3, networkId, dispatch);
    const exchange = loadExchange(web3, networkId, dispatch);
    
    //console.log("totalSupply", totalSupply);
    //console.log("abi", Token.abi);
    //console.log("address", Token.networks[networkId].address); 
    //console.log("accounts", accounts); 
  }

  render() {
    return (
      <div>
        <Navbar />
        <Content />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    // todo fill me in
  }
}


export default connect(mapStateToProps)(App);
