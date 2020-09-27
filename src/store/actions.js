// Web3
export function web3Loaded(connection) {
  return {
    type: 'WEB3_LOADED',
    connection
  }
}

export function web3AccountLoaded(account) {
  return {
    type: 'WEB3_ACCOUNT_LOADED',
    account
  }
}

// Token
export function TokenLoaded(contract) {
  return {
    type: 'TOKEN_LOADED',
    contract
  }
}

// Exchange
export function ExchangeLoaded(exchange) {
  return {
    type: 'EXCHANGE_LOADED',
    exchange
  }
}

//Cancelled Orders
export function cancelledOredersLoaded(cancelledOrders) {
  return {
    type: 'CANCELLED_ORDERS_LOADED',
    cancelledOrders
  }
}

export function filledOrdersLoaded(filledOrders) {
  return {
    type: 'FILLED_ORDERS_LOADED',
    filledOrders
  }
}

export function allOrdersLoaded(allOrders) {
  return {
    type: 'ALL_ORDERS_LOADED',
    allOrders
  }
}

export function orderCancelling() {
  return {
    type: 'ORDER_CANCELLING',
  }
}

export function orderCancelled(order) {
  return {
    type: 'ORDER_CANCELLED',
    order
  }
}

export function orderFilled(order) {
  return {
    type: 'ORDER_FILLED',
    order
  }
}

export function orderFilling() {
  return {
    type: 'ORDER_FILLING',
  }
}

export function etherBalanceLoaded(balance) {
  return {
    type: 'ETHER_BALANCE_LOADED',
    balance
  }
}
export function tokenBalanceLoaded(balance) {
  return {
    type: 'TOKEN_BALANCE_LOADED',
    balance
  }
}

export function exchangeEtherBalanceLoaded(balance) {
  return {
    type: 'EXCHANGE_ETHER_BALANCE_LOADED',
    balance
  }
}

export function exchangeTokenBalanceLoaded(balance) {
  return {
    type: 'EXCHANGE_TOKEN_BALANCE_LOADED',
    balance
  }
}

export function balancesLoaded() {
  return {
    type: 'BALANCES_LOADED'
  }
}

export function balancesLoading() {
  return {
    type: 'BALANCES_LOADING'
  }
}
