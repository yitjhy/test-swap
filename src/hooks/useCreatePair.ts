import { useContract } from '@/hooks/contract/useContract'
import { ABI } from '@/utils/abis'
import { contractAddress } from '@/utils/enum'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'ethers'
import { useCallback } from 'react'

type TAddLiquidity = (fromAddress: string, toAddress: string, amountFrom: BigNumber, amountTo: BigNumber) => any
type TAddLiquidityETH = (address: string, amount: BigNumber, ethValue: { value: BigNumber }) => any
const deadline = '1904274732000'
const useAddLiquidity = () => {
  const { account } = useWeb3React()
  const LPContract = useContract(contractAddress.router, ABI.router)
  const addLiquidity: TAddLiquidity = useCallback(
    (fromAddress, toAddress, amountFrom, amountTo) => {
      return LPContract?.addLiquidity(fromAddress, toAddress, amountFrom, amountTo, 0, 0, account, deadline)
    },
    [account, LPContract]
  )
  const addLiquidityETH: TAddLiquidityETH = useCallback(
    (address, amount, ethValue) => {
      return LPContract?.addLiquidityETH(address, amount, 0, 0, account, deadline, ethValue)
    },
    [account, LPContract]
  )
  return { addLiquidity, LPContract, addLiquidityETH }
}
export default useAddLiquidity
