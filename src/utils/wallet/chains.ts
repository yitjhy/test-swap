import type { AddEthereumChainParameter } from '@web3-react/types'
import { Chain } from '@/types/enum'

const ETH: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
}

const MATIC: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Matic',
  symbol: 'MATIC',
  decimals: 18,
}

const BSC: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'BNB',
  symbol: 'BNB',
  decimals: 18,
}

const BSCTest: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'tBNB',
  symbol: 'tBNB',
  decimals: 18,
}

const Goerli: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'goerliETH',
  symbol: 'gETH',
  decimals: 18,
}
const COMBOTEST: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Binance Chain Native Token',
  symbol: 'tcBNB',
  decimals: 18,
}

interface BasicChainInformation {
  urls: string[]
  name: string
}

interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter['nativeCurrency']
  blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls']
}

function isExtendedChainInformation(
  chainInformation: BasicChainInformation | ExtendedChainInformation
): chainInformation is ExtendedChainInformation {
  return !!(chainInformation as ExtendedChainInformation).nativeCurrency
}

export function getAddChainParameters(chainId: number): AddEthereumChainParameter | number {
  const chainInformation = CHAINS[chainId]
  if (isExtendedChainInformation(chainInformation)) {
    return {
      chainId,
      chainName: chainInformation.name,
      nativeCurrency: chainInformation.nativeCurrency,
      rpcUrls: chainInformation.urls,
      blockExplorerUrls: chainInformation.blockExplorerUrls,
    }
  } else {
    return chainId
  }
}

export const CHAINS: {
  [chainId: number]: BasicChainInformation | ExtendedChainInformation
} = {
  [Chain.BSC]: {
    name: 'Binance Smart Chain',
    nativeCurrency: BSC,
    urls: ['https://bsc-dataseed1.ninicoin.io'],
    blockExplorerUrls: ['https://bscscan.com/'],
  },
  [Chain.ETH]: {
    urls: ['https://cloudflare-eth.com'],
    name: 'Mainnet',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://etherscan.io'],
  },
  [Chain.Goerli]: {
    urls: ['https://goerli.infura.io/v3/'],
    name: 'Goerli 测试网络',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://goerli.etherscan.io'],
  },
  [Chain.OPT]: {
    urls: ['https://goerli.optimism.io'],
    name: 'Optimism Goerli',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://goerli-optimism.etherscan.io'],
  },
  [Chain.COMBOTest]: {
    name: 'Combo Testnet',
    nativeCurrency: COMBOTEST,
    urls: ['https://test-rpc.combonetwork.io'],
    blockExplorerUrls: ['https://combotrace-testnet.nodereal.io/'],
  },
}

export const URLS: { [chainId: number]: string[] } = Object.keys(CHAINS).reduce<{ [chainId: number]: string[] }>(
  (accumulator, chainId) => {
    const validURLs: string[] = CHAINS[+chainId].urls

    if (validURLs.length) {
      accumulator[Number(chainId)] = validURLs
    }

    return accumulator
  },
  {}
)

// export const supportChainIds = [Chain.BSC, Chain.ETH]
export const supportChainIds = [Chain.COMBOTest, Chain.OPT, Chain.Goerli, Chain.ETH, Chain.BSC]
// export const supportChainIds = [Chain.COMBOTest]
