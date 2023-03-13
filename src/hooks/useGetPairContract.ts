import { useContract } from '@/hooks/contract/useContract'
import { contractAddress } from '@/utils/enum'
import { ABI } from '@/utils/abis'

const useGetPairContract = () => {
  const factoryContract = useContract(contractAddress.factory, ABI.Factory)
  const getPairContractAddress = factoryContract?.getPair
  return { getPairContractAddress, factoryContract }
}
export default useGetPairContract
