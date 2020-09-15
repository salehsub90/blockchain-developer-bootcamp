import { createSelector } from 'reselect';
import { get } from 'lodash';
import { ETHER_ADDRESS, tokens, ether, GREEN, RED } from '../helpers'
import moment from 'moment';


//const account = state => state.web3.account;
const account = state => get(state, 'web3.account');
export const accountSelector = createSelector(account, a => a);

const tokenLoaded = state => get(state, 'token.loaded', false);
export const tokenLoadedSelector = createSelector(tokenLoaded, tl => tl)

const exchangeLoaded = state => get(state, 'exchange.loaded', false);
export const exchangeLoadedSelector = createSelector(exchangeLoaded, el => el)

const exchange = state => get(state, 'exchange.contract');
export const exchangeSelector = createSelector(exchange, e => e)

export const contractsLoadedSelector = createSelector(
  tokenLoaded,
  exchangeLoaded,
  (tl, el) => (tl && el)
)

const filledOrdersLoaded = state => get(state, 'exchange.filledOrders.loaded', false)
export const filledOrdersLoadedSelector = createSelector(filledOrdersLoaded, loaded => loaded)

const filledOrders = state => get(state, 'exchange.filledOrders.data', [])
export const filledOrdersSelector = createSelector(
  filledOrders, 
  (orders) => {
    // sort order by date ascending for price comparison
    orders = orders.sort((a,b) => a.timestamp - b.timestamp)

    // Decorate the orders
    orders = decorateFilledOrders(orders)

    // sort order by date descending for display
    orders = orders.sort((a,b) => b.timestamp - a.timestamp)
    console.log(orders) 
    return orders;
  }
)

const decorateFilledOrders = (orders) => {
  let previousOrder = orders[0];
  return (
    orders.map((order) => {
      order = decorateOrder(order);
      order = decorateFilledOrder(order, previousOrder);
      previousOrder = order // Update the previous order once it is decorated
      return order
    })
  );
}

const decorateOrder = (order) => {
  let etherAmount;
  let tokenAmount;

  if (order.tokenGive === ETHER_ADDRESS) {
    etherAmount = order.amountGive;
    tokenAmount = order.amountGet;
  }
  else {
    etherAmount = order.amountGet;
    tokenAmount = order.amountGive;
  }

  // Calculate token price to 5 decimal places
  const precision = 100000;
  let tokenPrice = (etherAmount / tokenAmount)
  tokenPrice = Math.round(tokenPrice * precision) / precision;

  let formattedTimestamp = moment.unix(order.timestamp).format('h:mm:ss a M/D');

  return({
    ...order,
    etherAmount: ether(etherAmount),
    tokenAmount: tokens(tokenAmount),
    tokenPrice,
    formattedTimestamp: formattedTimestamp
  })
}

const decorateFilledOrder = (order, previousOrder) => {
  return ({
    ...order,
    tokenPriceClass: tokenPriceClass(order.tokenPrice, order.id, previousOrder)
  })
}

const tokenPriceClass = (tokenPrice, orderId, previousOrder) => {
  //show green price if order price hight than prev
  if (previousOrder.id === orderId) {
    return GREEN;
  }

  //show red if order price lower than
  if (previousOrder.tokenPrice <= tokenPrice) {
    return GREEN; //success
  } else {
    return RED; //danger
  }
}