import { gql, useQuery } from '@apollo/client'
import { findAllPaths, generateGraph } from '@/utils'
import { useCallback, useEffect, useState } from 'react'
import { parseUnits } from 'ethers/lib/utils'
import { getContract, useContract } from '@/hooks/contract/useContract'
import { contractAddress } from '@/utils/enum'
import { ABI } from '@/utils/abis'
import { HunterswapRouter02 } from '@/utils/abis/HunterswapRouter02'
import { BigNumber } from 'ethers'
import { Chain } from '@/types/enum'
import { useSigner } from '@/hooks/contract/useSigner'
import { isSameAddress } from '@/utils/address'
import { AddressZero } from '@ethersproject/constants'

export enum ExactType {
  exactIn = 'exactIn',
  exactOut = 'exactOut',
}
const GET_All_PAIRS = gql`
  query {
    pairs {
      id
      totalSupply
      reserve0
      reserve1
      token0 {
        id
        symbol
        decimals
      }
      token1 {
        id
        symbol
        decimals
      }
    }
  }
`

type TToken = {
  decimals: string
  id: string
  symbol: string
}
type TPair = {
  id: string
  reserve0: string
  reserve1: string
  token0: TToken
  token1: TToken
}

type TRouteToken = {
  address: string
  decimals: string
  symbol: string
  chainId: Chain
}
type TRoutePair = {
  address: string
  amountIn: string
  amountOut: string
  reserve0: { quotient: string; token: TRouteToken }
  reserve1: { quotient: string; token: TRouteToken }
  tokenIn: TRouteToken
  tokenOut: TRouteToken
}

const getAllTokens = (pairs: TPair[]) => {
  return pairs.reduce<Record<string, TToken>>((pre, cur) => {
    if (!pre[cur.token0.id]) {
      pre[cur.token0.id] = cur.token0
    }
    if (!pre[cur.token1.id]) {
      pre[cur.token1.id] = cur.token1
    }
    return pre
  }, {})
}

const getGraphVertexes = (pairs: TPair[]) => {
  return Object.keys(getAllTokens(pairs))
}
const getGraphEdge = (pairs: TPair[]) => {
  return pairs.map((item) => {
    return [item.token0.id, item.token1.id]
  })
}

const useRoute2 = (inToken: string, outToken: string, amount: string, exactType: ExactType) => {
  const { loading, error, data, refetch } = useQuery<{ pairs: TPair[] }>(GET_All_PAIRS)
  const [routes, setRoutes] = useState<TRoutePair[]>([])
  const routerContract = useContract<HunterswapRouter02>(contractAddress.router, ABI.router)
  const signer = useSigner()
  // const inContract = useContract(inToken, ABI.ERC20)
  // const outContract = useContract(outToken, ABI.ERC20)
  const amount2bigNumber = async (amount: string, exactType: ExactType, inToken: string, outToken: string) => {
    const inContract = await getContract(inToken as string, ABI.ERC20, signer)
    const outContract = await getContract(outToken as string, ABI.ERC20, signer)
    if (exactType === ExactType.exactOut) {
      const outDecimals = await outContract?.decimals()
      return parseUnits(amount, outDecimals)
    } else {
      const inDecimals = await inContract?.decimals()
      return parseUnits(amount, inDecimals)
    }
  }
  const getAmount = async (
    routes: string[][],
    amount: string,
    exactType: ExactType,
    inToken: string,
    outToken: string
  ) => {
    const _amount = await amount2bigNumber(amount, exactType, inToken, outToken)
    const promiseList = routes.map((item) => {
      if (exactType === ExactType.exactOut) {
        return routerContract?.getAmountsIn(_amount, item)
      } else {
        return routerContract?.getAmountsOut(_amount, item)
      }
    })
    const amountList = await Promise.all(promiseList)
    // const res2 = amountList.map((item) => {
    //   return item?.map((item2) => {
    //     return item2.toString()
    //   })
    // })
    // console.log(res2)
    return amountList
  }

  const getRoutes = useCallback(
    async (inToken: string, outToken: string, amount: string, exactType: ExactType) => {
      if (data && data.pairs && data.pairs.length) {
        // const pair
        const pairGraph = generateGraph(getGraphVertexes(data.pairs), getGraphEdge(data.pairs))
        console.log(pairGraph)
        const routes = findAllPaths(pairGraph, inToken.toLowerCase(), outToken.toLowerCase())
        const resAmount = await getAmount(routes as string[][], amount, exactType, inToken, outToken).then()
        let res: TRoutePair[][] = []
        if (!resAmount || resAmount.length === 0 || !routes || routes.length === 0) {
          setRoutes([])
          return []
        } else {
          routes.map((item, index) => {
            res[index] = []
            for (let i = 0; i < item.length - 1; i++) {
              data.pairs.map((pair) => {
                if (
                  (pair.token0.id === item[i] || pair.token1.id === item[i]) &&
                  (pair.token0.id === item[i + 1] || pair.token1.id === item[i + 1])
                ) {
                  const token0Obj = {
                    symbol: pair.token0.symbol,
                    decimals: pair.token0.decimals,
                    address: pair.token0.id,
                    chainId: Chain.COMBOTest,
                  }
                  const token1Obj = {
                    symbol: pair.token1.symbol,
                    decimals: pair.token1.decimals,
                    address: pair.token1.id,
                    chainId: Chain.COMBOTest,
                  }
                  // @ts-ignore
                  const baseObj = {
                    address: pair.id,
                    reserve0: {
                      quotient: parseUnits(pair.reserve0, pair.token0.decimals).toString(),
                      token: token0Obj,
                    },
                    reserve1: {
                      quotient: parseUnits(pair.reserve1, pair.token1.decimals).toString(),
                      token: token1Obj,
                    },
                  }
                  let amountObj = {} as { amountIn: string; amountOut: string }
                  if (item.length === 2) {
                    amountObj = {
                      amountIn: (resAmount[index] as BigNumber[])[i].toString(),
                      amountOut: (resAmount[index] as BigNumber[])[i + 1].toString(),
                    }
                  } else {
                    amountObj = {
                      ...(i < item.length - 2
                        ? {
                            amountIn: (resAmount[index] as BigNumber[])[i].toString(),
                          }
                        : ({} as { amountIn: string })),
                      ...(i === item.length - 2
                        ? {
                            amountOut: (resAmount[index] as BigNumber[])[i + 1].toString(),
                          }
                        : ({} as { amountOut: string })),
                    }
                  }

                  if (pair.token0.id === item[i]) {
                    res[index].push({
                      ...baseObj,
                      ...amountObj,
                      tokenIn: token0Obj,
                      tokenOut: token1Obj,
                    })
                  } else {
                    res[index].push({
                      ...baseObj,
                      ...amountObj,
                      tokenIn: token1Obj,
                      tokenOut: token0Obj,
                    })
                  }
                }
              })
            }
          })
          setRoutes(res[0])
        }
      } else {
        setRoutes([])
      }
    },
    [data]
  )
  useEffect(() => {
    if (data && data.pairs && data.pairs.length && inToken && outToken && amount && amount !== '0') {
      getRoutes(
        isSameAddress(inToken, AddressZero) ? contractAddress.weth : inToken,
        isSameAddress(outToken, AddressZero) ? contractAddress.weth : outToken,
        amount,
        exactType
      ).then()
    }
  }, [data, inToken, outToken, amount, exactType])
  return { routes, getRoutes, loading }
}

export default useRoute2
