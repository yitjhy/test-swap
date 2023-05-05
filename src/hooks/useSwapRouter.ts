import { useCallback, useEffect, useMemo, useState } from 'react'
import { useContract } from '@/hooks/contract/useContract'
import { ABI } from '@/utils/abis'
import useErc20Info from '@/hooks/contract/useERC20Info'
import { HunterswapRouter02 } from '@/utils/abis/HunterswapRouter02'
import { HunterswapFactory } from '@/utils/abis/HunterswapFactory'
import { HunterswapPair } from '@/utils/abis/HunterswapPair'
import { BigNumber, constants } from 'ethers'
import { isSameAddress } from '@/utils/address'
import { useMulProvider } from '@/hooks/contract/useMulProvider'
import { useContracts } from '@/hooks/contract/useContracts'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { useWeb3React } from '@web3-react/core'
import moment from 'moment'
import { DialogType, useDialog } from '@/components/dialog'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { getErrorMsg, sleep } from '@/utils'
import { AddressZero, Zero } from '@ethersproject/constants'
import useRoutes, { ExactType } from '@/hooks/useRoute2'
import { contractAddress } from '@/utils/enum'

export enum SwapLock {
  In,
  Out,
}

function useReserves(factoryAddress: string, tokenIn: string, tokenOut: string) {
  const [pairAddress, setPairAddress] = useState('')
  const factory = useContract<HunterswapFactory>(factoryAddress, ABI.Factory)
  const { multiCallContract: pair, contract } = useContracts<HunterswapPair>(pairAddress, ABI.pair)
  const provider = useMulProvider()
  const [reserveIn, setReserveIn] = useState(constants.Zero)
  const [reserveOut, setReserveOut] = useState(constants.Zero)
  useEffect(() => {
    if (factory && tokenIn && tokenOut) {
      factory.getPair(tokenIn, tokenOut).then(setPairAddress)
    }
  }, [factory, tokenIn, tokenOut])
  useEffect(() => {
    if (provider && pair && !isSameAddress(pairAddress, constants.AddressZero) && contract) {
      const syncListener = {
        callback: function (reserve0: BigNumber, reserve1: BigNumber) {
          console.log(reserve0, reserve1)
        },
      }
      provider.all([pair.token0(), pair.token1(), pair.getReserves()]).then((res) => {
        const [token0, token1, reserves] = res
        if (isSameAddress(token0, tokenIn)) {
          setReserveIn(reserves[0])
          setReserveOut(reserves[1])
          syncListener.callback = (reserve0: BigNumber, reserve1: BigNumber) => {
            setReserveIn(reserve0)
            setReserveOut(reserve1)
          }
        } else {
          setReserveIn(reserves[1])
          setReserveOut(reserves[0])
          syncListener.callback = (reserve0, reserve1) => {
            setReserveIn(reserve1)
            setReserveOut(reserve0)
          }
        }
        contract.on('Sync', syncListener.callback)
      })
      return () => {
        contract.off('Sync', syncListener.callback)
      }
    }
  }, [pair, pairAddress, contract, tokenIn, tokenOut])
  const pairs = useMemo(() => (!!pairAddress ? [pairAddress] : []), [pairAddress])
  return { reserveIn, reserveOut, pairs }
}

export function useSwap(tokenIn: string, tokenOut: string) {
  const [inAmount, setInAmount] = useState('0')
  const [outAmount, setOutAmount] = useState('0')
  const [slippage, setSlippage] = useState(500) // 5-> 5/10000
  const [lock, setLock] = useState(SwapLock.In)
  const tokenInInfo = useErc20Info(tokenIn)
  const tokenOutInfo = useErc20Info(tokenOut)
  const [factoryAddress, setFactoryAddress] = useState('')
  const [wethAddress, setWethAddress] = useState('')
  const _tokenIn = isSameAddress(tokenIn, constants.AddressZero) ? wethAddress : tokenIn
  const _tokenOut = isSameAddress(tokenOut, constants.AddressZero) ? wethAddress : tokenOut
  const { contract: router, multiCallContract: mulRouter } = useContracts<HunterswapRouter02>(
    contractAddress.router,
    ABI.router
  )
  const {
    routes,
    loading,
    refresh: refreshRoute,
  } = useRoutes(
    _tokenIn,
    _tokenOut,
    lock === SwapLock.In ? inAmount : outAmount,
    lock === SwapLock.In ? ExactType.exactIn : ExactType.exactOut
  )
  const { reserveIn, reserveOut, pairs } = useReserves(factoryAddress, _tokenIn, _tokenOut)
  const [deadLine, setDeadLine] = useState(300) // 5 min
  const provider = useMulProvider()
  const { account, provider: web3Provider } = useWeb3React()
  const { openDialog, close } = useDialog()

  const [currentSlippage, setCurrentSlippage] = useState(0)
  const [rate, setRate] = useState(0)

  useEffect(() => {
    if (mulRouter && provider) {
      provider.all([mulRouter.WETH(), mulRouter.factory()]).then((res) => {
        setWethAddress(res[0])
        setFactoryAddress(res[1])
      })
    }
  }, [mulRouter, provider])

  useEffect(() => {
    if (parseValue(inAmount, tokenInInfo.decimals).gt(Zero) && !loading) {
      setRate(formatValue(outAmount, tokenOutInfo.decimals) / formatValue(inAmount, tokenInInfo.decimals))
    }
  }, [inAmount, outAmount, tokenInInfo, tokenOutInfo, loading])

  useEffect(() => {
    if (lock === SwapLock.In) {
      // console.log(loading, routes, lock)
      if (!loading) {
        const outRoute = routes[routes.length - 1]
        if (routes.length > 0) {
          setOutAmount(formatUnits(outRoute.amountOut, +outRoute.tokenOut.decimals))
        } else {
          setOutAmount('0')
        }
      }
    }
  }, [routes, loading])

  useEffect(() => {
    if (lock === SwapLock.Out) {
      if (!loading) {
        if (routes.length > 0) {
          const inRoute = routes[0]
          setInAmount(formatUnits(inRoute.amountIn, +inRoute.tokenIn.decimals))
        } else {
          setInAmount('0')
        }
      }
    }
  }, [routes, loading])

  const updateIn = useCallback(
    (amount: number | string) => {
      setInAmount(amount + '')
      setLock(SwapLock.In)
    },
    [tokenInInfo]
  )
  const updateOut = useCallback(
    (amount: number | string) => {
      setOutAmount(amount + '')
      setLock(SwapLock.Out)
    },
    [tokenOutInfo]
  )

  useEffect(() => {
    if (!loading) {
      if (routes.length > 0) {
        const prices = routes.map((route) => {
          const [reserve0Amount, reserve1Amount] = [
            +formatUnits(route.reserve0.quotient, +route.reserve0.token.decimals),
            +formatUnits(route.reserve1.quotient, +route.reserve1.token.decimals),
          ]
          const [reserveIn, reserveOut] = isSameAddress(route.tokenIn.address, route.reserve0.token.address)
            ? [reserve0Amount, reserve1Amount]
            : [reserve1Amount, reserve0Amount]
          return reserveOut / reserveIn
        })
        const inValue = +formatUnits(routes[0].amountIn, tokenInInfo.decimals)
        const outValue = +formatUnits(routes[routes.length - 1].amountOut, tokenOutInfo.decimals)
        const midPrice = prices.reduce((_midPrice, curPrice) => _midPrice * curPrice, 1)
        const midOutValue = midPrice * inValue
        setCurrentSlippage(Math.round(((midOutValue - outValue) / midOutValue - 0.003 * routes.length) * 10000))
      }
    }
  }, [routes, loading])

  const [maxIn, minOut] = useMemo(() => {
    if (+inAmount == 0 || +outAmount == 0) return [constants.Zero, constants.Zero]
    const inValue = parseValue(inAmount, tokenInInfo.decimals)
    const outValue = parseValue(outAmount, tokenOutInfo.decimals)
    const maxInValue = inValue.mul(10000 + slippage).div(10000)
    const minOutValue = outValue.mul(10000).div(10000 + slippage)
    return [maxInValue, minOutValue]
  }, [inAmount, outAmount, tokenInInfo.decimals, tokenOutInfo.decimals, reserveIn, reserveOut])

  const swap = useCallback(
    async (isExpert?: boolean) => {
      if (!router || !account || !web3Provider) return
      const inValue = parseValue(inAmount, tokenInInfo.decimals)
      const outValue = parseValue(outAmount, tokenOutInfo.decimals)
      const _minOut = isExpert ? constants.Zero : minOut.mul(10000).div(12000)
      const balance = await web3Provider.getBalance(account)
      const gasFee = (await web3Provider.getGasPrice()).mul(200000)

      const _maxIn =
        isExpert && isSameAddress(tokenIn, AddressZero)
          ? balance.lte(gasFee)
            ? 0
            : balance.sub(gasFee)
          : maxIn.mul(12000).div(10000)

      const _deadline = moment().add(deadLine, 'second').unix()
      try {
        let tx: TransactionResponse | null = null
        openDialog({ title: 'Swap', desc: 'Waiting for signature', type: DialogType.loading })
        const paths = Array.from(new Set([...routes.map((x) => [x.tokenIn.address, x.tokenOut.address]).flat(10)]))
        if (isSameAddress(tokenIn, constants.AddressZero)) {
          // eth for erc20
          if (lock === SwapLock.In) {
            tx = await router.swapExactETHForTokens(_minOut, paths, account, _deadline, {
              value: inValue,
            })
          } else {
            tx = await router.swapETHForExactTokens(outValue, paths, account, _deadline, {
              value: _maxIn,
            })
          }
        } else if (isSameAddress(tokenOut, constants.AddressZero)) {
          // erc20 for eth
          if (lock === SwapLock.In) {
            tx = await router.swapExactTokensForETH(inValue, _minOut, paths, account, _deadline)
          } else {
            tx = await router.swapTokensForExactETH(outValue, _maxIn, paths, account, _deadline)
          }
        } else {
          // erc20 for erc20
          if (lock === SwapLock.In) {
            tx = await router.swapExactTokensForTokens(inValue, _minOut, paths, account, _deadline)
          } else {
            tx = await router.swapTokensForExactTokens(outValue, _maxIn, paths, account, _deadline)
          }
        }
        openDialog({ title: 'Swap', desc: 'Waiting for blockchain confirmation', type: DialogType.loading })
        const res = await tx.wait()
        console.log(res)
        console.log(res.effectiveGasPrice.toString())
        // openDialog({ title: 'Success', desc: 'Swap Successed', type: DialogType.success })
        // await sleep(1500)
        close()
        return {
          success: true,
          transHash: res.transactionHash,
          errMsg: null,
        }
      } catch (e: any) {
        // openDialog({ title: 'Error', desc: getErrorMsg(e), type: DialogType.warn })
        // await sleep(1500)
        close()
        return {
          success: false,
          transHash: null,
          errMsg: getErrorMsg(e),
        }
      }
    },
    [
      tokenIn,
      tokenOut,
      lock,
      inAmount,
      outAmount,
      router,
      tokenInInfo,
      tokenOutInfo,
      maxIn,
      minOut,
      deadLine,
      web3Provider,
    ]
  )
  return {
    inAmount,
    outAmount,
    rate,
    updateIn,
    updateOut,
    updateSlippage: setSlippage,
    updateDeadline: setDeadLine,
    swap,
    slippage,
    deadLine,
    reserveIn,
    reserveOut,
    tokenInInfo,
    tokenOutInfo,
    currentSlippage,
    pairs,
    maxIn,
    minOut,
    lock,
    loading,
    routes,
    refreshRoute,
  }
}

export function parseValue(value: string, decimals: number) {
  const length = value.length
  try {
    if (length > decimals) {
      return parseUnits(value, length).div(BigNumber.from(10).pow(length - decimals))
    } else {
      return parseUnits(value, decimals)
    }
  } catch (e) {
    return constants.Zero
  }
}

export function formatValue(value: string, decimals: number) {
  const parsedValue = parseValue(value, decimals)
  return +formatUnits(parsedValue, decimals)
}
