import { useContract } from './useContract'
import { useMultiContract } from './useMulContract'
import { Contract } from 'ethers'

export function useContracts<T extends Contract>(address: string | null | undefined, abi: any) {
  const contract = useContract<T>(address, abi)
  const multiCallContract = useMultiContract<T>(address, abi)
  return { contract, multiCallContract }
}
