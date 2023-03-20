import { BigNumber } from 'ethers'
import { HunterswapPair } from '@/utils/abis/HunterswapPair'

declare namespace Global {
  type TErc20Info = { address: string; name: string; symbol: string; decimals: number; balance: BigNumber }
  type TErc20InfoWithPair = TErc20Info & {
    // logoURI: string
    // chainId: number
    balanceOfPair?: BigNumber
  }
  type RateItem = {
    rate: BigNumber
    fromCurrency: TErc20InfoWithPair
    toCurrency: TErc20InfoWithPair
  }
  type TPairAmount = GetPromiseType<ReturnType<HunterswapPair['getReserves']>>
  type TPairDetail = {
    accountPairBalance: BigNumber
    pairDecimals: number
    LPShare: BigNumber
    pairAddress: string
    pairAmount: TPairAmount
    rate: RateItem[]
    tokens: TErc20InfoWithPair[]
  }
}
