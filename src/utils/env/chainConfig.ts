import { Chain } from '@/types/enum'

export interface IChainConfig {
  chainId: Chain
  name: string
  symbol: string
  decimals: number
  logo: string
  explorer: string
  ADDRESS_MULTIREG: string
  ADDRESS_MULTBUY: string
  ADDRESS_REGISTER: string
  ADDRESS_RESOLVER: string
}

const ETH: IChainConfig = {
  chainId: Chain.ETH,
  name: 'Ethereum',
  symbol: 'ETH',
  decimals: 18,
  logo: '',
  explorer: 'https://etherscan.io',
  ADDRESS_REGISTER: '0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5',
  ADDRESS_MULTIREG: '0xb0Dbbd384d8894E755A0B755B07da28bD426BC74',
  ADDRESS_RESOLVER: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
  ADDRESS_MULTBUY: '0x9a6dc972216f69423ca72213d9d8f4784386755b',
}

const BSC: IChainConfig = {
  chainId: Chain.BSC,
  name: 'Binance smart chain',
  symbol: 'BNB',
  decimals: 18,
  logo: '',
  explorer: 'https://bscscan.com',
  ADDRESS_REGISTER: '0x524bd5676d24d89C240276DB69A7De2960F519a7',
  ADDRESS_MULTIREG: '0xb0Dbbd384d8894E755A0B755B07da28bD426BC74',
  ADDRESS_RESOLVER: '0x7A18768EdB2619e73c4d5067B90Fd84a71993C1D',
  ADDRESS_MULTBUY: '0xa283e8Dd4959b79DA483ED94Fc1456cE915db437',
}

// const Goerli: IChainConfig = {
//   chainId: Chain.Goerli,
//   name: 'Goerli',
//   symbol: 'gETH',
//   decimals: 18,
//   logo: '',
//   ADDRESS_REGISTER: '0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5',
//   ADDRESS_MULTICALL: '0x46A7ffB7CF505506e88E43f07203603c9388Db7D',
//   ADDRESS_RESOLVER: '0xE264d5bb84bA3b8061ADC38D3D76e6674aB91852',
// }

export const chainConfig = {
  [Chain.ETH]: ETH,
  // [Chain.Goerli]: Goerli,
  [Chain.BSC]: BSC,
  // [Chain.BSCTest]: ETH,
}
