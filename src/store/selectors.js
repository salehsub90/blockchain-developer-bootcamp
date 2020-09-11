import { createSelector } from 'reselect';
import { get } from 'lodash';

//const account = state => state.web3.account;
const account = state => get(state, 'web3.account');

export const accountSelector = createSelector(account, a => a)