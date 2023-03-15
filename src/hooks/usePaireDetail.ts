import { TCurrencyListItem } from '@/context/remoteCurrencyListContext'
import { invalidAddress } from '@/utils/enum'
import { getContract } from '@/hooks/contract/useContract'
import { ABI } from '@/utils/abis'
import { parseUnits } from 'ethers/lib/utils'
import { TLPDetailProps } from '@/views/add/lp-detail'
import { TRateProps } from '@/views/add/rate'
import useGetPairContract from '@/hooks/useGetPairContract'
import { useWeb3React } from '@web3-react/core'
import { useSigner } from '@/hooks/contract/useSigner'
import useAmountOut from '@/hooks/useAmountOut'
import { useCallback } from 'react'

const useLPDetail = () => {
  const { getPairContractAddress } = useGetPairContract()
  const { account } = useWeb3React()
  const signer = useSigner()
  const { getAmountOut } = useAmountOut()

  const getLPDetail = useCallback(
    async (pairContractAddress: string) => {
      // const pairContractAddress = await getPairContractAddress(checkedFromCurrency.address, checkedToCurrency.address)
      if (pairContractAddress !== invalidAddress && pairContractAddress) {
        const pairContract = await getContract(pairContractAddress, ABI.pair, signer)
        const pairDecimals = await pairContract?.decimals()
        const accountPairBalance = await pairContract?.balanceOf(account)
        const pairAmount = await pairContract?.getReserves()
        const poolLPBalance = await pairContract?.totalSupply()
        const LPShare = parseUnits('1', 8).mul(accountPairBalance).div(poolLPBalance)
        const accountToken0Balance = pairAmount._reserve0.mul(accountPairBalance).div(poolLPBalance)
        const accountToken1Balance = pairAmount._reserve1.mul(accountPairBalance).div(poolLPBalance)

        const token0Address = await pairContract?.token0()
        const token1Address = await pairContract?.token1()
        const token0Contract = await getContract(token0Address, ABI.ERC20, signer)
        const token1Contract = await getContract(token1Address, ABI.ERC20, signer)
        const token0symbol = await token0Contract?.symbol()
        const token1symbol = await token1Contract?.symbol()
        const token0Decimal = await token0Contract?.decimals()
        const token1Decimal = await token1Contract?.decimals()
        const token0Name = await token0Contract?.name()
        const token1Name = await token1Contract?.name()

        const token0 = {
          symbol: token0symbol,
          decimals: token0Decimal,
          balance: accountToken0Balance,
          name: token0Name,
          address: token0Address,
        }
        const token1 = {
          symbol: token1symbol,
          decimals: token1Decimal,
          balance: accountToken1Balance,
          name: token1Name,
          address: token1Address,
        }
        const tokens: TLPDetailProps['tokens'] = [token0, token1] as any

        let rateOfToken0 = await getAmountOut(
          parseUnits('1', token0Decimal),
          pairAmount._reserve0,
          pairAmount._reserve1
        )
        let rateOfToken1 = await getAmountOut(
          parseUnits('1', token1Decimal),
          pairAmount._reserve1,
          pairAmount._reserve0
        )
        let rate: TRateProps['rate'] = [
          { rate: rateOfToken0, fromCurrency: token0, toCurrency: token1 },
          { rate: rateOfToken1, fromCurrency: token1, toCurrency: token0 },
        ] as any
        return {
          accountPairBalance,
          pairDecimals,
          LPShare,
          tokens,
          rate,
          pairAddress: pairContractAddress,
        }
      } else {
        console.log('pair不存在')
        console.log(pairContractAddress)
        return {} as any
      }
    },
    [getPairContractAddress, account, signer, getAmountOut]
  )
  return { getLPDetail }
}
export default useLPDetail
