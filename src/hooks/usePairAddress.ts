import { useContract } from '@/hooks/contract/useContract'
import { contractAddress } from '@/utils/enum'
import { ABI } from '@/utils/abis'
import { useEffect, useState } from 'react'
import { constants } from 'ethers'

const usePairAddress = (fromAddress: string, toAddress: string) => {
  const factoryContract = useContract(contractAddress.factory, ABI.Factory)
  const getPairContractAddress = factoryContract?.getPair
  const [pairAddress, setPairAddress] = useState<string>(constants.AddressZero)
  const getPairAddress = async () => {
    const pairAddress = await getPairContractAddress(fromAddress, toAddress)
    setPairAddress(pairAddress)
  }
  useEffect(() => {
    if (fromAddress && toAddress) {
      getPairAddress().then()
    }
  }, [fromAddress, toAddress])
  return { getPairContractAddress, factoryContract, pairAddress }
}
export default usePairAddress
