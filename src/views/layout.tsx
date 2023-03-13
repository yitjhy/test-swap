import React, { PropsWithChildren } from 'react'
import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { WalletConnect } from '@web3-react/walletconnect'
import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { connectors } from '@/utils/wallet/connectors'
import Header from '@/views/header'
import { WalletProvider } from '@/context/WalletContext'
import { RemoteCurrencyListProvider } from '@/context/remoteCurrencyListContext'
import DialogProvider from '@/components/dialog'

const usedConnectors: [MetaMask | WalletConnect | CoinbaseWallet, Web3ReactHooks][] = connectors.map((connector) => [
  connector[0],
  connector[1],
])
const Layout: React.FC<PropsWithChildren<{}>> = (props) => {
  return (
    <Web3ReactProvider connectors={usedConnectors}>
      <WalletProvider>
        <DialogProvider>
          <RemoteCurrencyListProvider>
            <Header />
            {props.children}
          </RemoteCurrencyListProvider>
        </DialogProvider>
      </WalletProvider>
    </Web3ReactProvider>
  )
}
export default Layout
