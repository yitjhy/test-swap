import {useEffect, useMemo, useState} from 'react'
import { useWeb3React } from '@web3-react/core'
import { constants } from 'ethers'
import { useContracts } from './useContracts'
import { ABI } from '@/utils/abis'
import { useMulProvider } from './useMulProvider'
import { ERC20 } from '@/utils/abis/ERC20'

const _cache: { [key: string]: [string, string, number] | Promise<[string, string, number]> } = {
  [constants.AddressZero]: ['BNB', 'BNB', 18],
}
export default function useErc20Info(address: string) {
  const { multiCallContract, contract } = useContracts<ERC20>(address, ABI.ERC20)
  const provider = useMulProvider()
  const { isActive: active } = useWeb3React()
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [decimals, setDecimals] = useState(18)
  useEffect(() => {
    if (!address) return
    const cached = _cache[address]
    if (cached) {
      Promise.resolve(cached).then((res) => {
        setName(res[0])
        setSymbol(res[1])
        setDecimals(+res[2])
      })

      return
    }
    if (multiCallContract && provider && active) {
      const promise: Promise<[string, string, number]> = provider
        .all([multiCallContract.name(), multiCallContract.symbol(), multiCallContract.decimals()])
        .then(([name, symbol, decimals]) => {
          _cache[address] = [name, symbol, decimals]
          setName(name)
          setSymbol(symbol)
          setDecimals(+decimals)
          return [name, symbol, +decimals]
        })
      // .catch((e) => {
      //   delete _cache[address]
      // })
      _cache[address] = promise
    }
  }, [active, multiCallContract, provider, address])
  return useMemo(() => ({ name, symbol, decimals }), [name, symbol, decimals])
}
