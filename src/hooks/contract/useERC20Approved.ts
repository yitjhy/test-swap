import { useContract } from './useContract'
import { useCallback, useMemo } from 'react'
import { constants } from 'ethers'
import useERC20Allowance from './useERC20Allowance'
import { ABI } from '@/utils/abis'
import { ERC20 } from '@/utils/abis/ERC20'
import { useDialog } from '@/components/dialog'

// 币的地址  合约的地址
export default function useERC20Approved(address: string, spender: string, targetAccount?: string) {
  const allowance = useERC20Allowance(address, spender, targetAccount)
  const contract = useContract<ERC20>(address, ABI.ERC20)

  const approved = useMemo(() => allowance.gte(constants.MaxUint256.div(2)), [allowance])
  const { openDialog, close } = useDialog()

  const approve = useCallback(async () => {
    if (contract) {
      try {
        openDialog({ title: 'Approve', desc: 'Waiting for signing.' })
        const operation = await contract.approve(spender, constants.MaxUint256)
        openDialog({ title: 'Approve', desc: 'Waiting for blockchain confirmation.' })
        await operation.wait()
        close()
        return true
      } catch (e) {
        return false
      }
    }
  }, [contract, spender])
  return { approved, approve }
}
