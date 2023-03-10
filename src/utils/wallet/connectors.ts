import { initializeConnector, Web3ReactHooks } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { WalletConnect } from '@web3-react/walletconnect'
import { supportChainIds, URLS } from './chains'
import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { Web3ReactStore } from '@web3-react/types'

export const metaMask = initializeConnector<MetaMask>((actions) => new MetaMask(actions), supportChainIds)

export const walletConnect = initializeConnector<WalletConnect>(
  (actions) =>
    new WalletConnect(actions, {
      rpc: URLS,
    }),
  supportChainIds
)

export const coinbase = initializeConnector<CoinbaseWallet>(
  (actions) =>
    new CoinbaseWallet(actions, {
      url: URLS[supportChainIds[0]][0],
      appName: 'sheep',
    })
)

export const connectorsMap = {
  metaMask: metaMask[0],
  walletConnect: walletConnect[0],
  coinbase: coinbase[0],
}

export type WalletName = keyof typeof connectorsMap

export const connectors: [MetaMask | WalletConnect | CoinbaseWallet, Web3ReactHooks, Web3ReactStore][] = [
  metaMask,
  walletConnect,
  coinbase,
]

export type WalletMame = keyof typeof connectorsMap
