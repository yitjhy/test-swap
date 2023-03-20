import { getContract } from '@/hooks/contract/useContract'
import { ABI } from '@/utils/abis'
import { parseUnits } from 'ethers/lib/utils'
import { TRateProps } from '@/views/add/rate'
import { useWeb3React } from '@web3-react/core'
import { useSigner } from '@/hooks/contract/useSigner'
import useAmountOut from '@/hooks/useAmountOut'
import { useCallback, useEffect, useState } from 'react'
import { useDialog } from '@/components/dialog'
import { isSameAddress } from '@/utils/address'
import { BigNumber, constants } from 'ethers'
import { HunterswapPair } from '@/utils/abis/HunterswapPair'
import { contractAddress, platformCurrencyData } from '@/utils/enum'
import { Global } from '@/types/global'

const usePairInfo = (pairAddress: string) => {
  const [pairDetail, setPairDetail] = useState<Global.TPairInfo>({} as Global.TPairInfo)
  const { account, provider } = useWeb3React()
  const signer = useSigner()
  const { getAmountOut } = useAmountOut()
  const { openDialog, close } = useDialog()

  const getPairDetail = useCallback(
    async (pairAddress: string) => {
      if (pairAddress && !isSameAddress(pairAddress, constants.AddressZero)) {
        openDialog({ title: 'Fetch', desc: 'Waiting for Fetch Liquidity Detail' })
        const pairContract = await getContract<HunterswapPair>(pairAddress, ABI.pair, signer)

        // const pairListener = (_reserve0: BigNumber, _reserve1: BigNumber) => {
        // }
        // pairContract?.on('Sync', pairListener)

        const pairDecimals = await pairContract?.decimals()
        const accountPairBalance = await pairContract?.balanceOf(account as string)
        const pairAmount = await pairContract?.getReserves()
        const poolLPBalance = await pairContract?.totalSupply()
        const LPShare = parseUnits('1', 8)
          .mul(accountPairBalance as BigNumber)
          .div(poolLPBalance as BigNumber)
        const accountToken0Balance = pairAmount?._reserve0
          .mul(accountPairBalance as BigNumber)
          .div(poolLPBalance as BigNumber)
        const accountToken1Balance = pairAmount?._reserve1
          .mul(accountPairBalance as BigNumber)
          .div(poolLPBalance as BigNumber)

        const token0Address = await pairContract?.token0()
        const token1Address = await pairContract?.token1()
        const token0Contract = await getContract(token0Address as string, ABI.ERC20, signer)
        const token1Contract = await getContract(token1Address as string, ABI.ERC20, signer)
        const token0symbol = await token0Contract?.symbol()
        const token1symbol = await token1Contract?.symbol()
        const token0Decimal = await token0Contract?.decimals()
        const token1Decimal = await token1Contract?.decimals()
        const token0Name = await token0Contract?.name()
        const token1Name = await token1Contract?.name()

        const token0balance = await token0Contract?.balanceOf(account)
        const token1balance = await token1Contract?.balanceOf(account)

        const platformBalance = await provider?.getBalance(account as string)

        const token0: Global.TErc20InfoWithPair = {
          symbol: isSameAddress(token0Address, contractAddress.weth) ? platformCurrencyData.symbol : token0symbol,
          decimals: token0Decimal,
          balance: isSameAddress(token0Address, contractAddress.weth) ? platformBalance : token0balance,
          balanceOfPair: accountToken0Balance as BigNumber,
          name: isSameAddress(token0Address, contractAddress.weth) ? platformCurrencyData.name : token0Name,
          address: isSameAddress(token0Address, contractAddress.weth)
            ? platformCurrencyData.address
            : (token0Address as string),
        }
        const token1: Global.TErc20InfoWithPair = {
          symbol: isSameAddress(token1Address, contractAddress.weth) ? platformCurrencyData.symbol : token1symbol,
          decimals: token1Decimal,
          balance: isSameAddress(token1Address, contractAddress.weth) ? platformBalance : token1balance,
          balanceOfPair: accountToken1Balance as BigNumber,
          name: isSameAddress(token1Address, contractAddress.weth) ? platformCurrencyData.name : token1Name,
          address: isSameAddress(token1Address, contractAddress.weth)
            ? platformCurrencyData.address
            : (token1Address as string),
        }
        const tokens: Global.TPairInfo['tokens'] = [token0, token1]

        let rateOfToken0 = await getAmountOut(
          parseUnits('1', token0Decimal),
          pairAmount?._reserve0,
          pairAmount?._reserve1
        )
        let rateOfToken1 = await getAmountOut(
          parseUnits('1', token1Decimal),
          pairAmount?._reserve1,
          pairAmount?._reserve0
        )
        let rate: TRateProps['rate'] = [
          { rate: rateOfToken0, fromCurrency: token0, toCurrency: token1 },
          { rate: rateOfToken1, fromCurrency: token1, toCurrency: token0 },
        ] as any
        close()
        const pairDetail = {
          pairAmount,
          accountPairBalance,
          pairDecimals,
          LPShare,
          tokens,
          rate,
          pairAddress: pairAddress,
        }
        setPairDetail(pairDetail as Global.TPairInfo)
        return pairDetail
      } else {
        setPairDetail({} as Global.TPairInfo)
        return {} as Global.TPairInfo
      }
    },
    [account, signer, getAmountOut]
  )
  const updatePairDetail = () => {
    getPairDetail(pairAddress).then()
  }
  useEffect(() => {
    if (pairAddress && account && signer && getAmountOut) {
      getPairDetail(pairAddress).then()
    }
  }, [pairAddress, account, signer, getAmountOut, getPairDetail])
  return { getPairDetail, pairDetail, updatePairDetail }
}
export default usePairInfo
