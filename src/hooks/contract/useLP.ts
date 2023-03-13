import { useContract } from './useContract'
import { ABI } from '@/utils/abis'
import { ERC20 } from '@/utils/abis/ERC20'

const useLP = () => {
  const LPContract = useContract('0x06b77FA72e62DBfB025eCe979f76C68F5A0a2fC3', ABI.Factory)
  // LPContract.create
}
