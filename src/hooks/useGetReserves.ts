import { useContract } from '@/hooks/contract/useContract'
import { contractAddress } from '@/utils/enum'
import { ABI } from '@/utils/abis'

const useGetReserves = () => {
  const LPContract = useContract(contractAddress.router, ABI.pair)
}
export default useGetReserves
