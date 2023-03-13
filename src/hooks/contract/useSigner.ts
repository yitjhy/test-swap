import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'

export function useSigner() {
  const { provider, account } = useWeb3React()
  //@ts-ignore
  return useMemo(() => provider?.getSigner(account) as JsonRpcSigner, [provider, account])
}
