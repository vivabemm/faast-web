import { createReducer } from 'redux-act'
import { omit } from 'lodash'

import { resetAll } from 'Actions/app'
import {
  walletAdded, walletUpdated, walletRemoved, allWalletsRemoved, 
  walletBalancesUpdating, walletBalancesUpdated, walletBalancesError,
  walletUsedAddressesUpdated,
  walletOrdersLoading, walletOrdersLoaded, walletOrdersAllLoaded,
} from 'Actions/wallet'
import { createUpserter, createUpdater } from 'Utilities/helpers'

const initialState = {}
const walletInitialState = {
  id: '',
  label: '',
  type: '',
  typeLabel: '',
  iconProps: '',
  address: '',
  isBlockstack: false,
  isReadOnly: false,
  isSignTxSupported: false,
  supportedAssets: [],
  nestedWalletIds: [],
  usedAddresses: [],
  balances: {},
  balancesUpdating: false,
  balancesLoaded: false,
  balancesError: '',

  ordersAllLoaded: false,
  ordersLoading: false,
}

const upsertWallet = createUpserter('id', walletInitialState)
const updateWallet = createUpdater('id')

export default createReducer({
  [resetAll]: () => initialState,
  [allWalletsRemoved]: () => initialState,
  [walletAdded]: upsertWallet,
  [walletUpdated]: (state, wallet) => updateWallet(state, {
    ...wallet,
    balancesLoaded: false,
  }),
  [walletRemoved]: (state, { id }) => omit(state, id),
  [walletBalancesUpdating]: (state, { id }) => updateWallet(state, {
    id,
    balancesUpdating: true,
  }),
  [walletBalancesUpdated]: (state, { id, balances }) => updateWallet(state, {
    id,
    balances,
    balancesUpdating: false,
    balancesLoaded: true
  }),
  [walletBalancesError]: (state, { id, error }) => updateWallet(state, {
    id,
    balancesError: error,
  }),
  [walletUsedAddressesUpdated]: (state, { id, usedAddresses }) => updateWallet(state, {
    id,
    usedAddresses
  }),
  [walletOrdersLoading]: (state, { walletId }) => updateWallet(state, {
    id: walletId,
    ordersLoading: true,
  }),
  [walletOrdersLoaded]: (state, { walletId }) => updateWallet(state, {
    id: walletId,
    ordersLoading: false,
  }),
  [walletOrdersAllLoaded]: (state, { walletId }) => updateWallet(state, {
    id: walletId,
    ordersAllLoaded: true,
  }),
}, initialState)
