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

