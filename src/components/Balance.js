import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadBalances } from '../store/interactions';
import Spinner from './Spinner';
import {
  web3Selector, 
  exchangeSelector, 
  tokenSelector, 
  accountSelector,
  etherBalanceSelector,
  tokenBalanceSelector,
  exchangeEtherBalanceSelector,
  exchangeTokenBalanceSelector,
  balancesLoadingSelector
} from '../store/selectors'

const showForm = (props) => {
  // to do the show form view template
}

class Balance extends Component {
  componentWillMount() {
    this.loadBlockChainData()
  }

  async loadBlockChainData() {
    const { dispatch, web3, exchange, token, account } = this.props
    await loadBalances(dispatch, web3, exchange, token, account)
  }



  render() {
    return (
      <div className="card bg-dark text-white">
        <div className="card-header">
          Balance
        </div>
        <div className="card-body">
          {this.props.showForm ? showForm(this.props) : <Spinner />}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const balancesLoading = balancesLoadingSelector(state)

  return {
    web3: web3Selector(state),
    exchange: exchangeSelector(state),
    token: tokenSelector(state),
    account: accountSelector(state),
    etherBalance: etherBalanceSelector(state),
    tokenBalance: tokenBalanceSelector(state),
    exchangeEtherBalance: exchangeEtherBalanceSelector(state),
    exchangeTokenBalance: exchangeTokenBalanceSelector(state),
    balancesLoading,
    showForm: !balancesLoading
  }
}

export default connect(mapStateToProps)(Balance)