import { useEffect, useMemo, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { BigNumber, constants } from 'ethers'
import { useContracts } from './useContracts'
import { ABI } from '@/utils/abis'
import { useMulProvider } from './useMulProvider'
import { ERC20 } from '@/utils/abis/ERC20'

const _cache: { [key: string]: [string, string, number, BigNumber] | Promise<[string, string, number]> } = {
  [constants.AddressZero]: ['BNB', 'BNB', 18, constants.Zero],
}
export default function useErc20Info(address: string) {
  const { multiCallContract, contract } = useContracts<ERC20>(address, ABI.ERC20)
  const provider = useMulProvider()
  const { isActive: active, account } = useWeb3React()
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [decimals, setDecimals] = useState(18)
  const [balance, setBalance] = useState(constants.Zero)
  useEffect(() => {
    if (!address) return
    const cached = _cache[address]
    if (cached) {
      Promise.resolve(cached).then((res) => {
        setName(res[0])
        setSymbol(res[1])
        setDecimals(+res[2])
        setBalance(balance)
      })
      return
    }
    if (multiCallContract && provider && active) {
      const promise: Promise<[string, string, number, BigNumber]> = provider
        .all([
          multiCallContract.name(),
          multiCallContract.symbol(),
          multiCallContract.decimals(),
          multiCallContract?.balanceOf(account as string),
        ])
        .then(([name, symbol, decimals, balance]) => {
          _cache[address] = [name, symbol, decimals, balance]
          setName(name)
          setSymbol(symbol)
          setDecimals(+decimals)
          setBalance(balance)
          return [name, symbol, +decimals, balance]
        })
      // .catch((e) => {
      //   delete _cache[address]
      // })
      // @ts-ignore
      _cache[address] = promise
    }
  }, [active, multiCallContract, provider, address, account])
  return useMemo(() => ({ name, symbol, decimals, balance, address }), [name, symbol, decimals, balance, address])
}
