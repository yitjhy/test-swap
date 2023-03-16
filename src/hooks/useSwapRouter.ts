import {useCallback, useEffect, useMemo, useState} from "react";
import {useContract} from "@/hooks/contract/useContract";
import {ABI} from "@/utils/abis";
import useErc20Info from "@/hooks/contract/useERC20Info";
import {HunterswapRouter02} from "@/utils/abis/HunterswapRouter02";
import {HunterswapFactory} from "@/utils/abis/HunterswapFactory";
import {HunterswapPair} from "@/utils/abis/HunterswapPair";
import {constants} from "ethers";
import {isSameAddress} from "@/utils/address";
import {useMulProvider} from "@/hooks/contract/useMulProvider";
import {useContracts} from "@/hooks/contract/useContracts";
import {useDebounceEffect} from "ahooks";
import {formatUnits, parseUnits} from "ethers/lib/utils";
import useERC20Approved from "@/hooks/contract/useERC20Approved";
import {useWeb3React} from "@web3-react/core";
import moment from "moment";
import {useDialog} from "@/components/dialog";
import {TransactionResponse} from "@ethersproject/abstract-provider";

const routerAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'

enum SwapLock {
    In,
    Out
}


function useReserves(factoryAddress: string, tokenIn: string, tokenOut: string) {
    const [pairAddress, setPairAddress] = useState('')
    const factory = useContract<HunterswapFactory>(factoryAddress, ABI.Factory)
    const {multiCallContract: pair} = useContracts<HunterswapPair>(pairAddress, ABI.pair)
    const provider = useMulProvider()
    const [reserveIn, setReserveIn] = useState(constants.Zero)
    const [reserveOut, setReserveOut] = useState(constants.Zero)
    useEffect(() => {
        if (factory) {
            factory.getPair(tokenIn, tokenOut).then(setPairAddress)
        }
    }, [factory, tokenIn, tokenOut])
    useEffect(() => {
        if (provider && pair && !isSameAddress(pairAddress, constants.AddressZero)) {
            provider.all([
                pair.token0(),
                pair.token1(),
                pair.getReserves()
            ]).then(res => {
                const [token0, token1, reserves] = res
                if (isSameAddress(token0, tokenIn)) {
                    setReserveIn(reserves[0])
                    setReserveOut(reserves[1])
                } else {
                    setReserveIn(reserves[1])
                    setReserveOut(reserves[0])
                }
            })
        }
    }, [pair, pairAddress])
    return {reserveIn, reserveOut}
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
    // const factory = useContract<HunterswapFactory>(factoryAddress, ABI.Factory)
    const {reserveIn, reserveOut} = useReserves(factoryAddress, isSameAddress(tokenIn , constants.AddressZero) ? wethAddress:tokenIn, tokenOut)
    const [deadLine, setDeadLine] = useState(300) // 5 min
    const provider = useMulProvider()
    const {account} = useWeb3React()
    const {approved, approve} = useERC20Approved(tokenIn, routerAddress)
    const {openDialog} = useDialog()

    useEffect(() => {
        if (mulRouter && provider) {
            provider.all([
                mulRouter.WETH(),
                mulRouter.factory()
            ]).then(res => {
                setWethAddress(res[0])
                setFactoryAddress(res[1])
            })
        }
    }, [mulRouter, provider])

    const rate = useMemo(() => {
        // 1 inToken = rate outToken
        const reserveInAmount = +formatUnits(reserveIn, tokenInInfo.decimals)
        const reserveOutAmount = +formatUnits(reserveOut, tokenOutInfo.decimals)
        if (reserveInAmount > 0) return reserveOutAmount / reserveInAmount
        return 0
    }, [reserveIn, reserveOut])

    useDebounceEffect(() => {
        if (lock === SwapLock.In && router) {
            const inValue = parseUnits(inAmount, tokenInInfo.decimals)
            if (inValue.eq(constants.Zero)) {
                setOutAmount('0')
            } else {
                router.getAmountOut(inValue, reserveIn, reserveOut).then(res => setOutAmount(formatUnits(res, tokenOutInfo.decimals)))
            }
        }
    }, [lock, inAmount, reserveIn, reserveOut])
    useDebounceEffect(() => {
        if (lock === SwapLock.Out && router) {
            const outValue = parseUnits(outAmount, tokenOutInfo.decimals)
            if (outValue.eq(constants.Zero)) {
                setInAmount('0')
            } else {
                router.getAmountIn(outValue, reserveIn, reserveOut).then(res => setInAmount(formatUnits(res, tokenInInfo.decimals)))
            }
        }
    }, [lock, outAmount, reserveOut, reserveIn])

    const updateIn = useCallback((amount: number | string) => {
        setInAmount(amount + '')
        setLock(SwapLock.In)
    }, [])
    const updateOut = useCallback((amount: number | string) => {
        setOutAmount(amount + '')
        setLock(SwapLock.Out)
    }, [])

    const swap = useCallback(async () => {
        if (!router || !account) return
        const inValue = parseUnits(inAmount, tokenInInfo.decimals)
        const outValue = parseUnits(outAmount, tokenOutInfo.decimals)
        const _deadline = moment().add(deadLine, 'second').unix()
        const maxInValue = inValue.add(inValue.mul(slippage).div(10000))
        const minOutValue = outValue.sub(outValue.mul(slippage).div(10000))
        try {
            if (!approved && !await approve()) {
                openDialog({title: 'Error', desc: 'Approval error.'})
                return
            }
            let tx:TransactionResponse|null = null
            openDialog({title: 'Swap', desc: 'Waiting for signature'})
            if (isSameAddress(tokenIn, constants.AddressZero)) {
                // eth for erc20
                if (lock === SwapLock.In) {
                    tx= await router.swapExactETHForTokens(minOutValue, [wethAddress, tokenOut], account, _deadline, {value: inValue})
                } else {
                    tx = await router.swapETHForExactTokens(outValue, [wethAddress, tokenOut], account, _deadline, {value: maxInValue})
                }

            } else if (isSameAddress(tokenOut, constants.AddressZero)) {
                // erc20 for eth
                if (lock === SwapLock.In) {
                    tx = await router.swapExactTokensForETH(inValue, minOutValue, [tokenIn, wethAddress], account, _deadline)
                } else {
                    tx = await router.swapTokensForExactETH(outValue, maxInValue, [tokenIn, wethAddress], account, _deadline)
                }
            } else {
                // erc20 for erc20
                if (lock === SwapLock.In) {
                    tx = await router.swapExactTokensForTokens(inValue, minOutValue, [tokenIn, tokenOut], account, _deadline)
                } else {
                    tx = await router.swapTokensForExactTokens(outValue, maxInValue, [tokenIn, tokenOut], account, _deadline)
                }
            }
            openDialog({title: 'Swap', desc: 'Waiting for blockchain confirmation'})
            await tx.wait()
            openDialog({title: 'Success', desc: 'Swap success'})
        } catch (e) {
            openDialog({title: 'Error', desc: 'Swap error'})
        }

    }, [tokenIn, tokenOut, lock, inAmount, outAmount, router, approved])

    return {inAmount, outAmount, rate, updateIn, updateOut, updateSlippage: setSlippage, updateDeadline: setDeadLine, swap, slippage, deadLine}
}