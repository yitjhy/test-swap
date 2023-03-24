import {useCallback, useEffect, useMemo, useState} from 'react'
import {useContract} from '@/hooks/contract/useContract'
import {ABI} from '@/utils/abis'
import useErc20Info from '@/hooks/contract/useERC20Info'
import {HunterswapRouter02} from '@/utils/abis/HunterswapRouter02'
import {HunterswapFactory} from '@/utils/abis/HunterswapFactory'
import {HunterswapPair} from '@/utils/abis/HunterswapPair'
import {BigNumber, constants} from 'ethers'
import {isSameAddress} from '@/utils/address'
import {useMulProvider} from '@/hooks/contract/useMulProvider'
import {useContracts} from '@/hooks/contract/useContracts'
import {useDebounceEffect} from 'ahooks'
import {formatUnits, parseUnits} from 'ethers/lib/utils'
import {useWeb3React} from '@web3-react/core'
import moment from 'moment'
import {useDialog} from '@/components/dialog'
import {TransactionResponse} from '@ethersproject/abstract-provider'
import {getErrorMsg} from '@/utils'
import {useSigner} from "@/hooks/contract/useSigner";
import {AddressZero, MaxUint256, Zero} from "@ethersproject/constants";
import de from "@walletconnect/qrcode-modal/dist/cjs/browser/languages/de";

const routerAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'

export enum SwapLock {
    In,
    Out,
}

function useReserves(factoryAddress: string, tokenIn: string, tokenOut: string) {
    const [pairAddress, setPairAddress] = useState('')
    const factory = useContract<HunterswapFactory>(factoryAddress, ABI.Factory)
    const {multiCallContract: pair, contract} = useContracts<HunterswapPair>(pairAddress, ABI.pair)
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
    return {reserveIn, reserveOut, pairs}
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
    const {contract: router, multiCallContract: mulRouter} = useContracts<HunterswapRouter02>(routerAddress, ABI.router)
    const {reserveIn, reserveOut, pairs} = useReserves(
        factoryAddress,
        isSameAddress(tokenIn, constants.AddressZero) ? wethAddress : tokenIn,
        isSameAddress(tokenOut, constants.AddressZero) ? wethAddress : tokenOut
    )
    const [deadLine, setDeadLine] = useState(300) // 5 min
    const provider = useMulProvider()
    const {account, provider: web3Provider} = useWeb3React()
    const {openDialog, close} = useDialog()
    const hasPath = pairs.length > 0

    useEffect(() => {
        if (mulRouter && provider) {
            provider.all([mulRouter.WETH(), mulRouter.factory()]).then((res) => {
                setWethAddress(res[0])
                setFactoryAddress(res[1])
            })
        }
    }, [mulRouter, provider])

    const rate = useMemo(() => {
        if (parseValue(inAmount, tokenInInfo.decimals).gt(Zero)) return  formatValue(outAmount, tokenOutInfo.decimals)/ formatValue(inAmount, tokenInInfo.decimals)
        return 0
    }, [inAmount, outAmount, tokenInInfo, tokenOutInfo])

    useDebounceEffect(() => {
        if (lock === SwapLock.In && router && hasPath) {
            const inValue = parseValue(inAmount, tokenInInfo.decimals)
            if (inValue.eq(constants.Zero)) {
                setOutAmount('0')
            } else {
                router.getAmountOut(inValue.gt(MaxUint256) ? MaxUint256 : inValue, reserveIn, reserveOut).then((res) => {
                    setOutAmount(formatUnits(res, tokenOutInfo.decimals))
                })
            }
        }
    }, [lock, inAmount, reserveIn, reserveOut, tokenInInfo, tokenOutInfo, rate, hasPath])
    useDebounceEffect(() => {
        if (lock === SwapLock.Out && router && hasPath) {
            const outValue = parseValue(outAmount, tokenOutInfo.decimals)
            if (outValue.eq(constants.Zero)) {
                setInAmount('0')
            } else {
                router
                    .getAmountIn(outValue.gt(reserveOut)&&reserveOut.gt(0) ? reserveOut.sub(1) : outValue, reserveIn, reserveOut)
                    .then((res) => setInAmount(formatUnits(res, tokenInInfo.decimals)))
            }
        }
    }, [lock, outAmount, reserveOut, reserveIn, tokenInInfo, tokenOutInfo, rate, hasPath])

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

    const currentSlippage = useMemo(() => {
        const currentPrice = reserveOut.gt(constants.Zero)
            ? +formatUnits(reserveIn, tokenInInfo.decimals) / +formatUnits(reserveOut, tokenOutInfo.decimals)
            : 0
        const swapPrice = +outAmount > 0 ? +inAmount / +outAmount : 0
        if (currentPrice === 0) return 0
        return Math.floor(((swapPrice - currentPrice) / currentPrice) * 10000)
    }, [reserveIn, reserveOut, inAmount, outAmount, tokenInInfo, tokenOutInfo])

    const [maxIn, minOut] = useMemo(() => {
        if (+inAmount == 0 || +outAmount == 0) return  [constants.Zero, constants.Zero]
        const inValue = parseValue(inAmount, tokenInInfo.decimals)
        const outValue = parseValue(outAmount, tokenOutInfo.decimals)
        const price = +formatUnits(reserveIn, tokenInInfo.decimals) / +formatUnits(reserveOut, tokenOutInfo.decimals)
        const maxPrice = price * (1 + slippage / 10000)
        const maxInValue = parseValue(
            (maxPrice * +formatUnits(outValue, tokenOutInfo.decimals)).toFixed(tokenInInfo.decimals),
            tokenInInfo.decimals
        )
        const minOutValue = parseValue(
            (+formatUnits(inValue, tokenInInfo.decimals) / maxPrice).toFixed(tokenOutInfo.decimals),
            tokenOutInfo.decimals
        )
        return [maxInValue, minOutValue]
    }, [inAmount, outAmount, tokenInInfo.decimals, tokenOutInfo.decimals, reserveIn, reserveOut])

    const swap = useCallback(async (isExpert?: boolean) => {
        if (!router || !account || !web3Provider) return
        const inValue = parseValue(inAmount, tokenInInfo.decimals)
        const outValue = parseValue(outAmount, tokenOutInfo.decimals)
        const _minOut = isExpert ? constants.Zero : minOut.mul(10000).div(12000)
        const balance = await web3Provider.getBalance(account)
        const gasFee = (await web3Provider.getGasPrice()).mul(200000)

        const _maxIn = isExpert && isSameAddress(tokenIn, AddressZero) ? balance.lte(gasFee) ? 0 :balance.sub(gasFee) : maxIn.mul(12000).div(10000)

        const _deadline = moment().add(deadLine, 'second').unix()
        try {
            let tx: TransactionResponse | null = null
            openDialog({title: 'Swap', desc: 'Waiting for signature'})
            if (isSameAddress(tokenIn, constants.AddressZero)) {
                // eth for erc20
                if (lock === SwapLock.In) {
                    tx = await router.swapExactETHForTokens(_minOut, [wethAddress, tokenOut], account, _deadline, {
                        value: inValue,
                    })
                } else {
                    tx = await router.swapETHForExactTokens(outValue, [wethAddress, tokenOut], account, _deadline, {
                        value: _maxIn,
                    })
                }
            } else if (isSameAddress(tokenOut, constants.AddressZero)) {
                // erc20 for eth
                if (lock === SwapLock.In) {
                    tx = await router.swapExactTokensForETH(inValue, _minOut, [tokenIn, wethAddress], account, _deadline)
                } else {
                    tx = await router.swapTokensForExactETH(outValue, _maxIn, [tokenIn, wethAddress], account, _deadline)
                }
            } else {
                // erc20 for erc20
                if (lock === SwapLock.In) {
                    tx = await router.swapExactTokensForTokens(inValue, _minOut, [tokenIn, tokenOut], account, _deadline)
                } else {
                    tx = await router.swapTokensForExactTokens(outValue, _maxIn, [tokenIn, tokenOut], account, _deadline)
                }
            }
            openDialog({title: 'Swap', desc: 'Waiting for blockchain confirmation'})
            await tx.wait()
            openDialog({title: 'Success', desc: 'Swap Successed'})
            setTimeout(() => {
                close()
            }, 1000)
        } catch (e: any) {
            openDialog({title: 'Error', desc: getErrorMsg(e)})
            setTimeout(() => {
                close()
            }, 1000)
        }
    }, [tokenIn, tokenOut, lock, inAmount, outAmount, router, tokenInInfo, tokenOutInfo, maxIn, minOut, deadLine, web3Provider])

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
        lock
    }
}

function parseValue(value: string, decimals: number) {
    const length = value.length
    try {
        if (length > decimals) {
            return parseUnits(value, length).div(BigNumber.from(10).pow(length - decimals))
        } else {
            return  parseUnits(value, decimals)
        }
    } catch (e) {
        return constants.Zero
    }
}

function formatValue(value: string, decimals: number) {
    const parsedValue = parseValue(value, decimals)
    return +formatUnits(parsedValue, decimals)
}
