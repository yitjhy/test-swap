import { useState, createContext, PropsWithChildren, FC, useEffect, useContext } from 'react'
import remoteCurrencyListAll from './currencyList.json'
import useErc20InfoList from '@/hooks/useErc20InfoList'
import { BigNumber, constants } from 'ethers'
import { Global } from '@/types/global'

// const url = 'https://gateway.ipfs.io/ipns/tokens.uniswap.org'

export type TRemoteCurrencyListItem = {
  address: string
  chainId: number
  decimals: number
  logoURI: string
  name: string
  symbol: string
}
export type TCurrencyListItem = Global.TErc20InfoWithPair & {
  logoURI: TRemoteCurrencyListItem['logoURI']
  chainId: TRemoteCurrencyListItem['chainId']
  balanceOfPair: BigNumber
}
type TRemoteCurrencyListContext = {
  remoteCurrencyList: TRemoteCurrencyListItem[]
  currencyList: Global.TErc20InfoWithPair[]
  update: () => void
}

const RemoteCurrencyListContext = createContext<TRemoteCurrencyListContext>({} as TRemoteCurrencyListContext)

export function useRemoteCurrencyList() {
  return useContext(RemoteCurrencyListContext)
}

export const baseAddress = [
  // '0xF31efB151C7a6bBcbCb06A9ACdC4063D1b964543',
  // '0x7EA65b801A4e31e621B56Fff92e48eD063f8016B',
  // '0x3A60c560EdCb5ed75020132387Ef1B077d104454',
  // '0xBCcEDcEb835F98dAc6fa5a3564Bf164F9A527261',
  constants.AddressZero,
  '0x30a2926428D33d5A6C0FB8892b89232a020991BE',
  '0xD1056161F4DbdeF58Ea976dA4D67daf04D44E230',
  '0x70167F357976Ec812536175FBA9D7665Cf71E737',
]

export const RemoteCurrencyListProvider: FC<PropsWithChildren> = ({ children }) => {
  const [erc20ListByUserAdded, setErc20ListByUserAdded] = useState<string[]>([])
  const [remoteCurrencyList, setRemoteCurrencyList] = useState<TRemoteCurrencyListItem[]>([])
  const currencyList = useErc20InfoList([
    // '0xF31efB151C7a6bBcbCb06A9ACdC4063D1b964543',
    // '0x7EA65b801A4e31e621B56Fff92e48eD063f8016B',
    // '0x3A60c560EdCb5ed75020132387Ef1B077d104454',
    // '0xBCcEDcEb835F98dAc6fa5a3564Bf164F9A527261',
    // constants.AddressZero,
    ...baseAddress,
    ...erc20ListByUserAdded,
  ])
  const update = () => {
    getErc20ListByUserAdded()
  }
  const getErc20ListByUserAdded = () => {
    const erc20ListByUserAdded = localStorage.getItem('erc20ListByUserAdded')
    if (erc20ListByUserAdded) {
      setErc20ListByUserAdded(JSON.parse(erc20ListByUserAdded))
    }
  }
  useEffect(() => {
    getErc20ListByUserAdded()
  }, [])

  // const getCurrencyList = () => {
  //   return currencyErc20InfoList.map((item) => {
  //     const findItem = remoteCurrencyList.find((item2) => item2.address === item.address) as TRemoteCurrencyListItem
  //     return {
  //       ...item,
  //       name: findItem.name,
  //       symbol: findItem.symbol,
  //       decimals: findItem.decimals,
  //       logoURI: findItem.logoURI,
  //       chainId: findItem.chainId,
  //     }
  //   })
  // }
  // // const fetchCurrencyList = async () => {
  // //   try {
  // //     // let response = await fetch(url)
  // //     // const res = await response.json()
  // //     const list = remoteCurrencyListAll.tokens as TRemoteCurrencyListItem[]
  // //     const addressList = list.filter((item) => {
  // //       return item.chainId === 5
  // //     })
  // //     setRemoteCurrencyList(addressList)
  // //   } catch (error) {
  // //   }
  // // }
  // // useEffect(() => {
  // //   const currencyList = getCurrencyList()
  // //   setCurrencyList(currencyList)
  // // }, [currencyErc20InfoList, remoteCurrencyList])
  // // useEffect(() => {
  // //   fetchCurrencyList().then()
  // // }, [])
  return (
    <RemoteCurrencyListContext.Provider
      value={{
        remoteCurrencyList,
        currencyList,
        update,
      }}
    >
      {children}
    </RemoteCurrencyListContext.Provider>
  )
}
