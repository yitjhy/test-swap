import { useWeb3React } from '@web3-react/core'
import { useContract } from '@/hooks/contract/useContract'
import { contractAddress } from '@/utils/enum'
import { ABI } from '@/utils/abis'
import { useCallback } from 'react'
import { BigNumber } from 'ethers'

type TRemoveLiquidity = (fromAddress: string, toAddress: string, liquidity: BigNumber) => any
type TRemoveLiquidityETH = (address: string, liquidity: BigNumber) => any
const deadline = '1904274732000'
const useRemoveLiquidity = () => {
  const { account } = useWeb3React()
  const routerContract = useContract(contractAddress.router, ABI.router)
  const removeLiquidity: TRemoveLiquidity = useCallback(
    (fromAddress, toAddress, liquidity) => {
      return routerContract?.removeLiquidity(fromAddress, toAddress, liquidity, 0, 0, account, deadline)
    },
    [account, routerContract]
  )
  const removeLiquidityETH: TRemoveLiquidityETH = useCallback(
    (fromAddress, liquidity) => {
      return routerContract?.removeLiquidityETH(fromAddress, liquidity, 0, 0, account, deadline)
    },
    [account, routerContract]
  )
  return { removeLiquidity, routerContract, removeLiquidityETH }
}
export default useRemoveLiquidity
