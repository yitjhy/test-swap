import { useContract } from '@/hooks/contract/useContract'
import { ABI } from '@/utils/abis'
import { contractAddress } from '@/utils/enum'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'ethers'
import { useCallback } from 'react'
import { useDialog } from '@/components/dialog'

type TAddLiquidity = (fromAddress: string, toAddress: string, amountFrom: BigNumber, amountTo: BigNumber) => any
type TAddLiquidityETH = (address: string, amount: BigNumber, ethValue: { value: BigNumber }) => any
const deadline = '1904274732000'
const useAddLiquidity = () => {
  const { account } = useWeb3React()
  const LPContract = useContract(contractAddress.router, ABI.router)
  const { openDialog, close } = useDialog()
  const addLiquidity: TAddLiquidity = useCallback(
    async (fromAddress, toAddress, amountFrom, amountTo) => {
      try {
        openDialog({ title: 'Add Liquidity', desc: 'Waiting for signing.' })
        const operation = await LPContract?.addLiquidity(
          fromAddress,
          toAddress,
          amountFrom,
          amountTo,
          0,
          0,
          account,
          deadline
        )
        openDialog({ title: 'Add Liquidity', desc: 'Waiting for blockchain confirmation.' })
        await operation.wait()
        close()
        return true
      } catch (e) {
        close()
        return false
      }
    },
    [account, LPContract]
  )
  const addLiquidityETH: TAddLiquidityETH = useCallback(
    async (address, amount, ethValue) => {
      try {
        openDialog({ title: 'Add Liquidity', desc: 'Waiting for signing.' })
        const operation = await LPContract?.addLiquidityETH(address, amount, 0, 0, account, deadline, ethValue)
        openDialog({ title: 'Add Liquidity', desc: 'Waiting for blockchain confirmation.' })
        await operation.wait()
        close()
        return true
      } catch (e) {
        close()
        return false
      }
    },
    [account, LPContract]
  )
  return { addLiquidity, LPContract, addLiquidityETH }
}
export default useAddLiquidity
