import { useWeb3React } from '@web3-react/core'
import { useContract } from '@/hooks/contract/useContract'
import { contractAddress } from '@/utils/enum'
import { ABI } from '@/utils/abis'
import { useCallback } from 'react'
import { BigNumber } from 'ethers'
import { DialogType, useDialog } from '@/components/dialog'
import { getErrorMsg, sleep } from '@/utils'

type TRemoveLiquidity = (
  fromAddress: string,
  toAddress: string,
  liquidity: BigNumber,
  fromLiquidityTokenMin: BigNumber,
  toLiquidityTokenMin: BigNumber,
  deadline: number
) => any
type TRemoveLiquidityETH = (
  address: string,
  liquidity: BigNumber,
  erc20LiquidityTokenMin: BigNumber,
  ethLiquidityTokenMin: BigNumber,
  deadline: number
) => any
const useRemoveLiquidity = () => {
  const { account } = useWeb3React()
  const routerContract = useContract(contractAddress.router, ABI.router)
  const { openDialog, close } = useDialog()
  const removeLiquidity: TRemoveLiquidity = useCallback(
    async (fromAddress, toAddress, liquidity, fromLiquidityTokenMin, toLiquidityTokenMin, deadline) => {
      try {
        openDialog({ title: 'Remove', desc: 'Waiting for signing', type: DialogType.loading })
        const operation = await routerContract?.removeLiquidity(
          fromAddress,
          toAddress,
          liquidity,
          fromLiquidityTokenMin,
          toLiquidityTokenMin,
          account,
          deadline
        )
        openDialog({ title: 'Remove', desc: 'Waiting for blockchain confirmation', type: DialogType.loading })
        await operation.wait()
        openDialog({ title: 'Remove', desc: 'Remove Successed', type: DialogType.success })
        await sleep(1500)
        close()
        return true
      } catch (e) {
        openDialog({ title: 'Error', desc: getErrorMsg(e), type: DialogType.warn })
        await sleep(1500)
        close()
        return false
      }
    },
    [account, routerContract]
  )
  const removeLiquidityETH: TRemoveLiquidityETH = useCallback(
    async (fromAddress, liquidity, erc20LiquidityTokenMin, ethLiquidityTokenMin, deadline) => {
      try {
        openDialog({ title: 'Remove', desc: 'Waiting for signing', type: DialogType.loading })
        const operation = await routerContract?.removeLiquidityETH(
          fromAddress,
          liquidity,
          erc20LiquidityTokenMin,
          ethLiquidityTokenMin,
          account,
          deadline
        )
        openDialog({ title: 'Remove', desc: 'Waiting for blockchain confirmation', type: DialogType.loading })
        await operation.wait()
        openDialog({ title: 'Remove', desc: 'Remove Successed', type: DialogType.success })
        await sleep(1500)
        close()
        return true
      } catch (e) {
        openDialog({ title: 'Error', desc: getErrorMsg(e), type: DialogType.warn })
        await sleep(1500)
        close()
        return false
      }
    },
    [account, routerContract]
  )
  return { removeLiquidity, routerContract, removeLiquidityETH }
}
export default useRemoveLiquidity
