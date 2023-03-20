import useLPDetail from '@/hooks/usePairDetail'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { getAddress } from '@/utils'
import { isSameAddress } from '@/utils/address'
import { constants } from 'ethers'
import useGetPairContract from '@/hooks/usePairAddress'
import { useEffect } from 'react'

const useValueByInput = (fromAddress: string, toAddress: string) => {
  const { pairAddress } = useGetPairContract(fromAddress, toAddress)
  const { getPairDetail } = useLPDetail(pairAddress)
  const getOutValueByInputIn = async (value: string | undefined) => {
    if (!isSameAddress(pairAddress, constants.AddressZero)) {
      const { tokens, pairAmount } = await getPairDetail(pairAddress)
      if (pairAmount) {
        if (value) {
          if (tokens[0].address === fromAddress) {
            const outValue = pairAmount._reserve1
              .mul(parseUnits(String(value), tokens[0].decimals))
              .div(pairAmount._reserve0)
            return {
              value: formatUnits(outValue, tokens[1].decimals),
              bigNumberValue: outValue,
            }
          } else {
            const outValue = pairAmount._reserve0
              .mul(parseUnits(String(value), tokens[1].decimals))
              .div(pairAmount._reserve1)
            return {
              value: formatUnits(outValue, tokens[0].decimals),
              bigNumberValue: outValue,
            }
          }
        } else {
          return {
            value: undefined,
            bigNumberValue: constants.Zero,
          }
        }
      }
    }
  }
  const getInValueByInputOut = async (value: string | undefined) => {
    if (!isSameAddress(pairAddress, constants.AddressZero)) {
      const { tokens, pairAmount } = await getPairDetail(pairAddress)
      if (pairAmount) {
        if (value) {
          if (tokens[0].address === fromAddress) {
            const outValue = pairAmount._reserve0
              .mul(parseUnits(String(value), tokens[1].decimals))
              .div(pairAmount._reserve1)
            return {
              value: formatUnits(outValue, tokens[0].decimals),
              bigNumberValue: outValue,
            }
          } else {
            const outValue = pairAmount._reserve1
              .mul(parseUnits(String(value), tokens[0].decimals))
              .div(pairAmount._reserve0)
            return {
              value: formatUnits(outValue, tokens[1].decimals),
              bigNumberValue: outValue,
            }
          }
        } else {
          return {
            value: undefined,
            bigNumberValue: constants.Zero,
          }
        }
      }
    }
  }
  return { getOutValueByInputIn, getInValueByInputOut }
}
export default useValueByInput
