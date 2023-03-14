import { useContract } from '@/hooks/contract/useContract'
import { contractAddress } from '@/utils/enum'
import { ABI } from '@/utils/abis'

const useAmountOut = () => {
  const routerContract = useContract(contractAddress.router, ABI.router)
  const getAmountOut = routerContract?.getAmountOut
  return { getAmountOut, routerContract }
}
export default useAmountOut
