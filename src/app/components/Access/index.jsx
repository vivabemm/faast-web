import React from 'react'
import { Row, Col } from 'reactstrap'
import { Link } from 'react-router-dom'

import Layout from 'Components/Layout'
import Keystore from 'Components/Keystore'
import Web3Wallet from 'Components/Web3Wallet'
import CreateWallet from 'Components/CreateWallet'
import HardwareWallet from 'Components/HardwareWallet'
import Blockstack from 'Components/Blockstack'
import Button from 'Components/Button'

import styles from './style'

const TileRow = ({ children }) => (<div className='my-3'><Row className='large-gutters justify-content-center'>{children}</Row></div>)
const TileCol = ({ children }) => (<Col xs='9' sm='6' md='4' lg='3'>{children}</Col>)

const Access = () => (
  <Layout showAddressSearch view='connect'>
    <Row className='medium-gutters justify-content-end'>
      <Col xs='auto'>
        <Button tag={Link} to='/balances'>portfolio</Button>
      </Col>
    </Row>
    <h3 className={styles.title}>Select your wallet</h3>
    <h4 className={styles.walletRowHeading}>Hardware Wallets</h4>
    <h6 className={styles.walletRowSubheading}>Recommended</h6>
    <TileRow>
      <TileCol><HardwareWallet type='trezor' /></TileCol>
      <TileCol><HardwareWallet type='ledger' /></TileCol>
    </TileRow>
    <h4 className={styles.walletRowHeading}>Software Wallets</h4>
    <TileRow>
      <TileCol><Web3Wallet type='metamask' /></TileCol>
      <TileCol><Web3Wallet type='mist' /></TileCol>
      <TileCol><Web3Wallet type='parity' /></TileCol>
      <TileCol><Blockstack /></TileCol>
    </TileRow>
    <h4 className={styles.walletRowHeading}>Manual</h4>
    <TileRow>
      <TileCol><Keystore /></TileCol>
      <TileCol><CreateWallet /></TileCol>
    </TileRow>
    <div className={`row ${styles.bottomContainer}`}>
      <div className='col'>
        <div className={styles.openSourceContainer}>
          <a className={styles.openSourceLink} href='https://github.com/go-faast/faast-portfolio' target='_blank' rel='noopener noreferrer'>
            <div className={styles.openSource}>
              <i className='fa fa-github fa-2x' />
              <span className={styles.openSourceText}>open source and secure</span>
              <i className='fa fa-lock fa-2x' />
            </div>
          </a>
        </div>
      </div>
    </div>
  </Layout>
)

export default Access
