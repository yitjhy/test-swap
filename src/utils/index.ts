import Graphemer from 'graphemer'
import { contractAddress, invalidAddress } from '@/utils/enum'

const spliter = new Graphemer()

export const getEllipsisStr = (str: string, prefixLength = 6, breakPoints = prefixLength + 4) => {
  let res = str
  const ellipsis = '...'
  if (str) {
    const splitStrList = spliter.splitGraphemes(str)
    const length = splitStrList.length
    if (length > breakPoints) {
      const prefix = splitStrList.slice(0, prefixLength)
      const suffix = splitStrList.slice(length - 4)
      res = `${prefix.join('')}${ellipsis}${suffix.join('')}`
    }
  }
  return res
}

export const judgeImgUrl = (url: string) => {
  return url && !url.startsWith('ipfs')
}
export const getAddress = (fromAddress: string, toAddress: string) => {
  let fromAddress1 = fromAddress
  let toAddress1 = toAddress
  if (fromAddress1 === invalidAddress) {
    fromAddress1 = contractAddress.weth
  }
  if (toAddress1 === invalidAddress) {
    toAddress1 = contractAddress.weth
  }
  return {
    fromAddress: fromAddress1,
    toAddress: toAddress1,
  }
}


export function getErrorMsg(e: any) {
  return e.reason || e.data?.message || e.message
}