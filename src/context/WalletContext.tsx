import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useWeb3React, Web3ReactHooks } from '@web3-react/core'
import { coinbase, connectorsMap, metaMask, walletConnect, WalletMame, WalletName } from '@/utils/wallet/connectors'
import { storage } from '@/utils/storage'
import { getAddChainParameters, supportChainIds } from '@/utils/wallet/chains'
import useReference from '../hooks/useReference'
import { MetaMask } from '@web3-react/metamask'
import { WalletConnect } from '@web3-react/walletconnect'
import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { Web3ReactStore } from '@web3-react/types'
import { Chain } from '@/types/enum'

export interface WalletData {
  id: number
  name: string
  connector: [MetaMask | WalletConnect | CoinbaseWallet, Web3ReactHooks, Web3ReactStore]
  key: WalletName
  icon: string
}

const wallets: WalletData[] = [
  {
    id: 1,
    name: 'metaMask',
    connector: metaMask,
    key: 'metaMask',
    icon: '',
  },
  {
    id: 2,
    name: 'walletConnect',
    connector: walletConnect,
    icon: '',
    key: 'walletConnect',
  },
  {
    id: 3,
    name: 'coinbase',
    connector: coinbase,
    icon: '',
    key: 'coinbase',
  },
]

const WalletContext = createContext<{
  active: (walletName: WalletMame) => Promise<boolean>
  deActive: () => Promise<boolean>
  switchChain: (chainId: Chain) => Promise<boolean>
  wallets: WalletData[]
}>({
  wallets,
  active: async () => false,
  deActive: async () => false,
  switchChain: () => Promise.resolve(false),
})

export function useWallet() {
  return useContext(WalletContext)
}

function updateWalletConnectStatus(status: boolean) {
  sessionStorage.connectStatus = status
}

function getWalletConnectStatus() {
  return sessionStorage.connectStatus === 'true'
}

export const WalletProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { connector, isActive, error, account, chainId } = useWeb3React()
  const ref = useReference(error)
  const deActiveRef = useRef(false)
  const active = useCallback(
    async (walletName: WalletName) => {
      const wallet = connectorsMap[walletName]
      const isSameWallet = wallet === connector
      if (isSameWallet && isActive) {
        return true
      }
      try {
        // @ts-ignore
        await wallet.activate(Chain.COMBOTest)
        // if (!chainId || !supportChainIds.includes(chainId)) {
        //   // @ts-ignore
        //   await wallet.activate(getAddChainParameters(supportChainIds[0] as Chain))
        // } else {
        // }
        if (ref.current) {
          return false
        }
        updateWalletConnectStatus(true)
        storage.setItem('walletName', walletName)
        if (!isSameWallet) {
          connector.deactivate()
        }
        return true
      } catch (e) {
        return false
      }
    },
    [connector, isActive, chainId]
  )
  const switchChain = useCallback(
    async (chainId: Chain) => {
      if (connector) {
        try {
          ref.current = undefined
          await connector.activate(getAddChainParameters(chainId))
          if (ref.current) {
            connector.activate()
            throw new Error(ref.current)
          }
          updateWalletConnectStatus(true)
          return true
        } catch (e) {
          return false
        }
      }
      return false
    },
    [connector]
  )
  useEffect(() => {
    if (deActiveRef.current) return
    if (getWalletConnectStatus()) {
      active('metaMask')
    }
  }, [])
  useEffect(() => {
    if (!isActive) return
    if (account) {
      storage.setItem('currentAddress', account)
    } else {
      storage.remove('currentAddress')
    }
  }, [account, isActive])
  const deActive = useCallback(async () => {
    // if (!isActive) return true
    try {
      deActiveRef.current = true
      await connector.deactivate()
      updateWalletConnectStatus(false)
      return true
    } catch (e) {
      return false
    }
  }, [connector])
  return <WalletContext.Provider value={{ active, deActive, switchChain, wallets }}>{children}</WalletContext.Provider>
}
