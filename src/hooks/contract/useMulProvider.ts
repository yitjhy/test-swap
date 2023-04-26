import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'
import { Provider } from 'ethers-multicall'

export function useMulProvider() {
  const { chainId, provider, isActive } = useWeb3React()
  return useMemo(() => {
    if (!isActive || !provider) return null
    // @ts-ignore
    const _provider = new Provider(provider, chainId)
    if (chainId === 97) {
      //@ts-ignore
      _provider._multicallAddress = '0xb4C73DE178f26256B1f25a58F57A119F2A146E68'
    }
    if (chainId === 420) {
      // multicall:0xC04548628D69ea2640357B43511174C6458Ab573
      // 0x0118EF741097D0d3cc88e46233Da1e407d9ac139
      //@ts-ignore
      _provider._multicallAddress = '0xC04548628D69ea2640357B43511174C6458Ab573'
    }
    if (chainId === 91715) {
      // multicall:0xC04548628D69ea2640357B43511174C6458Ab573
      // 0x0118EF741097D0d3cc88e46233Da1e407d9ac139
      //@ts-ignore
      _provider._multicallAddress = '0x7afc25fAA56318E57dE68e60Cf2633444EE22505'
    }
    return _provider
  }, [provider, chainId, isActive])
}
