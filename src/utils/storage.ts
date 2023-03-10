import { WalletMame } from './wallet/connectors'
import { ENV } from '@/utils/env'
import { Chain } from '@/types/enum'

const isServer = ENV.isServer

export interface StorageData {
  walletName?: WalletMame
  chainId?: Chain
  user_tokens?: {
    access_token: string
    user_id: number
    expires_in: number
    address: string
  }[]
  currentAddress?: string
  commitCache?: {
    [name: string]: {
      randomBytes: string
      expiresIn: number
      commitIn: number
    }
  }
}

type KEY = keyof StorageData

function getItem<K extends keyof StorageData, R = StorageData[K]>(key: K): R | undefined {
  if (isServer || !window.localStorage.getItem(key)) return undefined
  return JSON.parse(window.localStorage.getItem(key) as string) as R
}

function setItem<K extends keyof StorageData, V = StorageData[K]>(key: KEY, value: V) {
  if (!isServer) {
    window.localStorage.setItem(key, JSON.stringify(value))
  }
}

function remove(key: KEY) {
  if (!isServer) {
    window.localStorage.removeItem(key)
  }
}

function clear() {
  if (!isServer) {
    window.localStorage.clear()
  }
}

export const storage = {
  getItem,
  setItem,
  remove,
  clear,
}
