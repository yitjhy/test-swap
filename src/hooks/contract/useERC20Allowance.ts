import { useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import { useContract } from './useContract'
import { ABI } from '@/utils/abis'
import useAccount from './useAccount'
import { isSameAddress } from '@/utils/address'
import { ERC20 } from '@/utils/abis/ERC20'
import { AddressZero, MaxUint256 } from '@ethersproject/constants'

export default function useERC20Allowance(address: string, spender: string, targetAccount?: string) {
  const [allowance, setAllowance] = useState(BigNumber.from(0))
  const contract = useContract<ERC20>(address, ABI.ERC20)
  const account = useAccount(targetAccount)

  useEffect(() => {
    if (contract && account && spender) {
      if (isSameAddress(address, AddressZero)) {
        setAllowance(MaxUint256)
        return
      }
      contract.allowance(account, spender).then(setAllowance)
      const approvalListener = (owner: string, _spender: string, amount: BigNumber) => {
        if (isSameAddress(owner, account) && isSameAddress(spender, _spender)) {
          setAllowance(amount)
        }
      }
      contract.on('Approval', approvalListener)
      return () => {
        contract.removeListener('Approval', approvalListener)
      }
    }
  }, [contract, account, spender])

  return allowance
}
