import { useContract } from '@/hooks/contract/useContract'
import { ABI } from '@/utils/abis'
import { contractAddress } from '@/utils/enum'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'ethers'
import { useCallback } from 'react'
import { DialogType, useDialog } from '@/components/dialog'
import { getErrorMsg, sleep } from '@/utils'

type TAddLiquidity = (
  fromAddress: string,
  toAddress: string,
  amountFrom: BigNumber,
  amountTo: BigNumber,
  amountFromMin: BigNumber,
  amountToMin: BigNumber,
  deadline: number
) => any
type TAddLiquidityETH = (
  address: string,
  amount: BigNumber,
  amountTokenMin: BigNumber,
  amountETHMin: BigNumber,
  deadline: number,
  ethValue: { value: BigNumber }
) => any
const useAddLiquidity = () => {
  const { account } = useWeb3React()
  const LPContract = useContract(contractAddress.router, ABI.router)
  const { openDialog, close } = useDialog()
  const addLiquidity: TAddLiquidity = useCallback(
    async (fromAddress, toAddress, amountFrom, amountTo, amountFromMin, amountToMin, deadline) => {
      try {
        openDialog({ title: 'Add Liquidity', desc: 'Waiting for signing', type: DialogType.loading })
        const operation = await LPContract?.addLiquidity(
          fromAddress,
          toAddress,
          amountFrom,
          amountTo,
          amountFromMin,
          amountToMin,
          account,
          deadline
        )
        openDialog({ title: 'Add Liquidity', desc: 'Waiting for blockchain confirmation', type: DialogType.loading })
        await operation.wait()
        openDialog({ title: 'Success', desc: 'Add Liquidity Successed', type: DialogType.success })
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
    [account, LPContract]
  )
  const addLiquidityETH: TAddLiquidityETH = useCallback(
    async (address, amount, amountTokenMin, amountETHMin, deadline, ethValue) => {
      try {
        openDialog({ title: 'Add Liquidity', desc: 'Waiting for signing', type: DialogType.loading })
        const operation = await LPContract?.addLiquidityETH(
          address,
          amount,
          amountTokenMin,
          amountETHMin,
          account,
          deadline,
          ethValue
        )
        openDialog({ title: 'Add Liquidity', desc: 'Waiting for blockchain confirmation', type: DialogType.loading })
        await operation.wait()
        openDialog({ title: 'Success', desc: 'Add Liquidity Successed', type: DialogType.success })
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
    [account, LPContract]
  )
  return { addLiquidity, LPContract, addLiquidityETH }
}
export default useAddLiquidity
