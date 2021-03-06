import * as React from 'react'
import { Router } from 'react-static'
import { Provider } from 'react-redux'
import { hot } from 'react-hot-loader'
import { compose, setDisplayName } from 'recompose'
import Routes from 'react-static-routes'

import store from './store'

import './styles/index.scss?global'

export default compose(
  setDisplayName('Root'),
  hot(module),
)(() => (
  <Provider store={store}>
    <Router>
      <Routes />
    </Router>
  </Provider>
))
