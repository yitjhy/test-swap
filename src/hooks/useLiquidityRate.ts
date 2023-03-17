import { getContract } from '@/hooks/contract/useContract'
import { ABI } from '@/utils/abis'
import { formatEther, formatUnits, parseUnits } from 'ethers/lib/utils'
import usePairAddress from '@/hooks/usePairAddress'
import { useSigner } from '@/hooks/contract/useSigner'
import { useCallback, useEffect, useState } from 'react'
import { getAddress } from '@/utils'
import { isSameAddress } from '@/utils/address'
import { constants } from 'ethers'

const useLiquidityRate = (
  from: { inputValue: number; address: string },
  to: { inputValue: number; address: string }
) => {
  const [shareOfPool, setShareOfPool] = useState('0')
  const { fromAddress, toAddress } = getAddress(from.address, to.address)
  const { pairAddress } = usePairAddress(fromAddress, toAddress)
  const signer = useSigner()
  const getLiquidityRate = useCallback(async () => {
    if (!isSameAddress(pairAddress, constants.AddressZero)) {
      const pairContract = await getContract(pairAddress, ABI.pair, signer)
      const pairAmount = await pairContract?.getReserves()
      const totalSupplyBigNumber = await pairContract?.totalSupply()
      const poolTotalSupply = formatEther(totalSupplyBigNumber)
      if (!totalSupplyBigNumber.isZero()) {
        // 已经有人添加过流动性
        const token0Address = await pairContract?.token0()
        const token1Address = await pairContract?.token1()
        const token0Contract = await getContract(token0Address, ABI.ERC20, signer)
        const token1Contract = await getContract(token1Address, ABI.ERC20, signer)
        const token0Decimal = await token0Contract?.decimals()
        const token1Decimal = await token1Contract?.decimals()
        if (token0Address === fromAddress) {
          const aa = parseUnits(String(from.inputValue), token0Decimal)
            .mul(totalSupplyBigNumber)
            .div(pairAmount._reserve0)
          const bb = parseUnits(String(to.inputValue), token1Decimal)
            .mul(totalSupplyBigNumber)
            .div(pairAmount._reserve1)
          const liquidity = aa.lt(bb) ? aa : bb
          const decimals = aa.lt(bb) ? token0Decimal : token1Decimal
          const rate3 = liquidity.mul(parseUnits('1', decimals)).div(totalSupplyBigNumber.add(liquidity))
          setShareOfPool(formatUnits(rate3, decimals - 2))
        } else {
          const aa = parseUnits(String(from.inputValue), token1Decimal)
            .mul(totalSupplyBigNumber)
            .div(pairAmount._reserve1)
          const bb = parseUnits(String(to.inputValue), token0Decimal)
            .mul(totalSupplyBigNumber)
            .div(pairAmount._reserve0)
          const liquidity = aa.lt(bb) ? aa : bb
          const decimals = aa.lt(bb) ? token1Decimal : token0Decimal
          const rate3 = liquidity.mul(parseUnits('1', decimals)).div(totalSupplyBigNumber.add(liquidity))
          setShareOfPool(formatUnits(rate3, decimals - 2))
        }
      } else {
        // 还没人添加过流动性
        const liquidity = Math.sqrt(Number(from.inputValue) * Number(to.inputValue)) - 1000
        setShareOfPool(String(liquidity / (Number(poolTotalSupply) + liquidity)))
      }
    } else {
      console.log(pairAddress)
      setShareOfPool('0')
    }
    return shareOfPool
  }, [from, to, signer, pairAddress])
  useEffect(() => {
    if (pairAddress && from.address && to.address && from.inputValue && to.inputValue) {
      getLiquidityRate().then()
    }
  }, [from, to, getLiquidityRate, pairAddress])
  return { getLiquidityRate, shareOfPool }
}
export default useLiquidityRate
