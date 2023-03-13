import { useContract } from '@/hooks/contract/useContract'
import { ABI } from '@/utils/abis'
import { contractAddress } from '@/utils/enum'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'ethers'
import { useCallback } from 'react'

type TAddLiquidity = (fromAddress: string, toAddress: string, amountFrom: BigNumber, amountTo: BigNumber) => any
const useAddLiquidity = () => {
  const { account } = useWeb3React()
  const LPContract = useContract(contractAddress.router, ABI.router)
  const addLiquidity: TAddLiquidity = useCallback(
    (fromAddress, toAddress, amountFrom, amountTo) => {
      return LPContract?.addLiquidity(fromAddress, toAddress, amountFrom, amountTo, 0, 0, account, '1904274732000')
    },
    [account, LPContract]
  )
  return { addLiquidity, LPContract }
}
export default useAddLiquidity
