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

export function TokenLoaded(account) {
  return {
    type: 'TOKEN_LOADED',
    account
  }
}
