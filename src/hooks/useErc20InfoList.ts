import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ABI } from '@/utils/abis'
import { useMulProvider } from './contract/useMulProvider'
import { ERC20 } from '@/utils/abis/ERC20'
import { ContractCall } from 'ethers-multicall'
import { useMultiContract, getMulContract } from '@/hooks/contract/useMulContract'
import { isSameAddress } from '@/utils/address'
import { constants } from 'ethers'
import { platFormAddress } from '@/utils/enum'

export type TErc20InfoItem = { address: string; name: any; symbol: any; decimals: any; balance: any }
// let _cache: TErc20InfoItem[] = []
export default function useErc20InfoList(addressList: string[]) {
  const { isActive: active, account, provider: singleProvider } = useWeb3React()
  const [list, setList] = useState<TErc20InfoItem[]>([])
  const provider = useMulProvider()
  const multiCallContractList = addressList
    .filter((address) => {
      return !isSameAddress(address, constants.AddressZero)
    })
    .reduce<ContractCall[]>((pre, address) => {
      const multiCallContract = getMulContract<ERC20>(address, ABI.ERC20)
      if (multiCallContract) {
        pre.push(multiCallContract?.name())
        pre.push(multiCallContract?.symbol())
        pre.push(multiCallContract?.decimals())
        pre.push(multiCallContract?.balanceOf(account as string))
      }
      return pre
    }, [])
  useEffect(() => {
    if (!addressList) return
    // if (_cache.length) {
    //   return
    // }
    if (multiCallContractList && provider && active) {
      // @ts-ignore
      const promise: Promise<TErc20InfoItem[]> = provider.all(multiCallContractList).then((res) => {
        const res2 = addressList
          .filter((address) => {
            return !isSameAddress(address, constants.AddressZero)
          })
          .map((address, index) => {
            return {
              address,
              name: res[index * 4],
              symbol: res[index * 4 + 1],
              decimals: res[index * 4 + 2],
              balance: res[index * 4 + 3],
            }
          })
        // _cache = res2

        const addressZeroIndex = addressList.findIndex((address) => isSameAddress(address, constants.AddressZero))
        if (addressZeroIndex < 0) {
          setList(res2)
          return res2
        } else {
          singleProvider?.getBalance(account as string).then((balance) => {
            const platformCurrency = {
              address: platFormAddress,
              name: 'HUNTERS',
              symbol: 'ETH',
              decimals: 18,
              balance,
            }
            if (addressZeroIndex === 0) {
              res2.unshift(platformCurrency)
              setList(res2)
              return res2
            } else {
              setList([...res2.slice(0, addressZeroIndex), platformCurrency, ...res2.slice(addressZeroIndex)])
              return [...res2.slice(0, addressZeroIndex), platformCurrency, ...res2.slice(addressZeroIndex)]
            }
          })
        }
      })
    }
  }, [active, multiCallContractList.length, provider, addressList.length])
  return list
}
