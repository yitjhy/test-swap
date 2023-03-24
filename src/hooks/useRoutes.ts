import { isSameAddress } from '@/utils/address'
import { constants } from 'ethers'
import { contractAddress, chainId } from '@/utils/enum'
import { parseUnits } from 'ethers/lib/utils'
import { cutOffStr, parseParams } from '@/utils'
import { getContract } from '@/hooks/contract/useContract'
import { ABI } from '@/utils/abis'
import { useSigner } from '@/hooks/contract/useSigner'
import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'

enum ExactType {
  exactIn = 'exactIn',
  exactOut = 'exactOut',
}
type Token = {
  chainId: number
  decimals: string
  address: string
  symbol: string
}
type TRouteResponseData = {
  route: {
    address: string
    tokenIn: Token
    tokenOut: Token
  }[][]
}
const useRoutes = (inAddress: string, outAddress: string, amount: string, exactType: ExactType) => {
  const { provider } = useWeb3React()
  const signer = useSigner()
  let _amount = '0'
  let inDecimals = 18
  let outDecimals = 18
  const [routePair, setRoutePair] = useState<string[]>([])
  const [routePath, setRoutePath] = useState<Token[]>([])

  const getRoutes = async () => {
    if (!isSameAddress(inAddress, constants.AddressZero)) {
      const inContract = await getContract(inAddress, ABI.ERC20, signer)
      inDecimals = await inContract?.decimals()
    }
    if (!isSameAddress(outAddress, constants.AddressZero)) {
      const outContract = await getContract(outAddress, ABI.ERC20, signer)
      outDecimals = await outContract?.decimals()
    }
    if (exactType === ExactType.exactIn) {
      _amount = parseUnits(cutOffStr(amount, inDecimals), inDecimals).toString()
    } else {
      _amount = parseUnits(cutOffStr(amount, outDecimals), outDecimals).toString()
    }
    const params = {
      protocols: 'v2',
      tokenInAddress: isSameAddress(inAddress, constants.AddressZero) ? contractAddress.weth : inAddress,
      tokenInChainId: chainId,
      tokenOutAddress: isSameAddress(outAddress, constants.AddressZero) ? contractAddress.weth : outAddress,
      tokenOutChainId: chainId,
      amount: _amount,
      type: exactType,
    }

    fetch(`https://api.uniswap.org/v1/quote?${parseParams(params)}`)
      .then((response) => response.json())
      .then((data: TRouteResponseData) => {
        if (data.route && data.route.length) {
          const routePair = data.route[0].map((item) => item.address)
          const routePath = data.route[0].reduce<Token[]>((pre, cur, index) => {
            if (index === 0) {
              pre.push(cur.tokenIn)
              pre.push(cur.tokenOut)
            } else {
              pre.push(cur.tokenOut)
            }
            return pre
          }, [])
          setRoutePair(routePair)
          setRoutePath(routePath)
        }
      })
  }
  useEffect(() => {
    if (inAddress && outAddress && exactType && amount && amount !== '0') {
      getRoutes().then()
    }
  }, [inAddress, outAddress, amount, exactType])
  return { routePair, routePath }
}
export default useRoutes
