import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { constants, BigNumber } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import { ABI } from '@/utils/abis'
import { useMulProvider } from './contract/useMulProvider'
import { ERC20 } from '@/utils/abis/ERC20'
import { ContractCall } from 'ethers-multicall'
import { useMultiContract, getMulContract } from '@/hooks/contract/useMulContract'

export type TErc20InfoItem = { address: string; name: any; symbol: any; decimals: any; balance: any }
let _cache: TErc20InfoItem[] = []
export default function useErc20InfoList(addressList: string[]) {
  const { isActive: active, account } = useWeb3React()
  const [list, setList] = useState<TErc20InfoItem[]>([])
  const provider = useMulProvider()
  const multiCallContractList = addressList.reduce<ContractCall[]>((pre, address) => {
    const multiCallContract = getMulContract<ERC20>(address, ABI.ERC20)
    if (multiCallContract) {
      pre.push(multiCallContract?.name())
      pre.push(multiCallContract?.symbol())
      pre.push(multiCallContract?.decimals())
      pre.push(multiCallContract?.balanceOf(account as string))
    }
    return pre
  }, [])
  // const getList = async () => {
  //   if (multiCallContractList && provider && active) {
  //     const res = await provider.all(multiCallContractList)
  //     const res2 = addressList.map((address, index) => {
  //       return {
  //         address,
  //         name: res[index * 4],
  //         symbol: res[index * 4 + 1],
  //         decimals: res[index * 4 + 2],
  //         balance: res[index * 4 + 3],
  //       }
  //     })
  //     _cache = res2
  //     setList(res2)
  //     return res2
  //   }
  // }
  useEffect(() => {
    if (!addressList) return
    if (_cache.length) {
      return
    }
    // getList().then()
    if (multiCallContractList && provider && active) {
      const promise: Promise<TErc20InfoItem[]> = provider.all(multiCallContractList).then((res) => {
        const res2 = addressList.map((address, index) => {
          return {
            address,
            name: res[index * 4],
            symbol: res[index * 4 + 1],
            decimals: res[index * 4 + 2],
            balance: res[index * 4 + 3],
          }
        })
        _cache = res2
        setList(res2)
        return res2
      })
    }
  }, [active, multiCallContractList, provider, addressList])
  return list
}
