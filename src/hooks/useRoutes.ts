import { chainId } from '@/utils/enum'
import { parseParams } from '@/utils'
import { useEffect, useState } from 'react'
import useErc20Info from '@/hooks/contract/useERC20Info'
import { parseValue } from '@/hooks/useSwapRouter'
import { useDebounceEffect } from 'ahooks'

export enum ExactType {
  exactIn = 'exactIn',
  exactOut = 'exactOut',
}

type Token = {
  chainId: number
  decimals: string
  address: string
  symbol: string
}

interface RouteItem {
  address: string
  amountIn: string
  amountOut: string
  reserve0: {
    quotient: string
    token: Token
  }
  reserve1: {
    token: Token
    quotient: string
  }
  tokenIn: Token
  tokenOut: Token
}

type TRouteResponseData = {
  route: RouteItem[][]
}
const useRoutes = (inAddress: string, outAddress: string, amount: string, exactType: ExactType) => {
  const inInfo = useErc20Info(inAddress)
  const outInfo = useErc20Info(outAddress)
  const [routes, setRoutes] = useState<RouteItem[]>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
  }, [inAddress, outAddress, amount, exactType])

  useDebounceEffect(() => {
    if (inAddress && outAddress && amount) {
      const _amount = parseValue(amount, (exactType === ExactType.exactOut ? outInfo : inInfo).decimals)
      const params = {
        protocols: 'v2',
        tokenInAddress: inAddress,
        tokenInChainId: chainId,
        tokenOutAddress: outAddress,
        tokenOutChainId: chainId,
        amount: _amount,
        type: exactType,
      }
      //@ts-ignore
      fetch(`https://api.uniswap.org/v1/quote?${parseParams(params)}`)
        .then((response) => response.json())
        .then((data: TRouteResponseData) => {
          if (data.route && data.route.length) {
            setRoutes(data.route[0])
          } else {
            setRoutes([])
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [inAddress, outAddress, amount, exactType, inInfo, outInfo])

  return { routes, loading }
}
export default useRoutes
