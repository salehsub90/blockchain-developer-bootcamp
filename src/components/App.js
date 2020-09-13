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
import { contractsLoadedSelector } from '../store/selectors';

class App extends Component {
  componentWillMount() {
    this.loadBlockChainData(this.props.dispatch);
  }

  async loadBlockChainData(dispatch) {
    const web3 = loadWeb3(dispatch);
    await web3.eth.net.getNetworkType();
    const networkId = await web3.eth.net.getId();
    await loadAccount(web3, dispatch);
    const token = await loadToken(web3, networkId, dispatch);
    if (!token) {
      window.alert('Token smart contract not detected on the current network. Please select another network with Metatmask.');
      return;
    }
    const exchange = await loadExchange(web3, networkId, dispatch);
    if (!exchange) {
      window.alert('Token smart contract not detected on the current network. Please select another network with Metatmask.');
      return;
    }
  }

  render() {
    return (
      <div>
        <Navbar />
        {this.props.contractsLoadedSelector ? <Content /> : <div className="content"></div>}
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log("contractsloaded?", contractsLoadedSelector(state))
  return {
    contractsLoadedSelector: contractsLoadedSelector(state)
  }
}


export default connect(mapStateToProps)(App);
