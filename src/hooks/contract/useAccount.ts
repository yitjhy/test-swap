import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'

export default function useAccount(targetAccount?: string) {
  const { account: myAccount } = useWeb3React()
  return useMemo(() => targetAccount || myAccount, [targetAccount, myAccount])
}
