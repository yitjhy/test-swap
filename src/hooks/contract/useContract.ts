import { Contract, providers } from 'ethers'
import { useSigner } from './useSigner'
import { useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'

export function getContract<T extends Contract>(
  address: string,
  ABI: any,
  signer?: providers.JsonRpcSigner | null
): T | null {
  try {
    return new Contract(address, ABI, signer || undefined) as T
  } catch (e) {
    return null
  }
}

export function useContract<T extends Contract>(address: string | null | undefined, abi: any): T | null {
  const { isActive } = useWeb3React()
  const signer = useSigner()
  const contract = useMemo(() => {
    if (!address || !isActive) return null
    return getContract<T>(address, abi, signer)
  }, [address, abi, signer])
  return contract as T
}
