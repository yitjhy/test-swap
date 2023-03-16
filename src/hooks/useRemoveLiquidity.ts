import { useWeb3React } from '@web3-react/core'
import { useContract } from '@/hooks/contract/useContract'
import { contractAddress } from '@/utils/enum'
import { ABI } from '@/utils/abis'
import { useCallback } from 'react'
import { BigNumber } from 'ethers'
import { useDialog } from '@/components/dialog'

type TRemoveLiquidity = (fromAddress: string, toAddress: string, liquidity: BigNumber) => any
type TRemoveLiquidityETH = (address: string, liquidity: BigNumber) => any
const deadline = '1904274732000'
const useRemoveLiquidity = () => {
  const { account } = useWeb3React()
  const routerContract = useContract(contractAddress.router, ABI.router)
  const { openDialog, close } = useDialog()
  const removeLiquidity: TRemoveLiquidity = useCallback(
    async (fromAddress, toAddress, liquidity) => {
      try {
        openDialog({ title: 'Remove', desc: 'Waiting for signing.' })
        const operation = await routerContract?.removeLiquidity(
          fromAddress,
          toAddress,
          liquidity,
          0,
          0,
          account,
          deadline
        )
        await operation.wait()
        close()
        return true
      } catch (e) {
        close()
        return false
      }
    },
    [account, routerContract]
  )
  const removeLiquidityETH: TRemoveLiquidityETH = useCallback(
    async (fromAddress, liquidity) => {
      try {
        openDialog({ title: 'Remove', desc: 'Waiting for signing.' })
        const operation = await routerContract?.removeLiquidityETH(fromAddress, liquidity, 0, 0, account, deadline)
        await operation.wait()
        close()
        return true
      } catch (e) {
        close()
        return false
      }
    },
    [account, routerContract]
  )
  return { removeLiquidity, routerContract, removeLiquidityETH }
}
export default useRemoveLiquidity
