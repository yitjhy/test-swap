import { Contract as MulContract, ContractCall } from 'ethers-multicall'
import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'
import { GetParamType } from '@/utils/types'

export function getMulContract<T>(address: string, ABI: any) {
  try {
    return new MulContract(address, ABI) as { [key in keyof T]: (...args: GetParamType<T[key]>) => ContractCall }
  } catch (e) {
    console.error(e)
    return null
  }
}
// { [key in keyof T]: (...args: GetParamType<T[key]>) => ContractCall }

export function useMultiContract<T>(address: string | null | undefined, abi: any) {
  const { isActive } = useWeb3React()
  const contract = useMemo(() => {
    if (!address || !isActive) return null
    return getMulContract<T>(address, abi)
  }, [address, abi, isActive])
  return contract
}
