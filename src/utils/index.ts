import Graphemer from 'graphemer'
import { contractAddress, invalidAddress } from '@/utils/enum'
import { TRoutePair } from '@/hooks/useRoute2'

const spliter = new Graphemer()

export function sleep(time: number) {
  return new Promise((resolve, reject) => setTimeout(resolve, time))
}

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

export const getStrByDecimalPlaces = (val: string, decimalPlaces = 12) => {
  if (val.includes('.')) {
    const arr = val.split('.')
    return arr[0] + '.' + arr[1].slice(0, decimalPlaces)
  } else {
    return val
  }
}
export const cutOffStr = (str: string, length: number) => {
  const arr = str.split('.')
  if (arr[1]) {
    return `${arr[0]}.${arr[1].slice(0, length)}`
  } else {
    return str
  }
}

export const addPairAddressToStorage = (account: string, pairAddress: string) => {
  const pairAddressListFromStorage = localStorage.getItem('pairAddressList')
  if (pairAddressListFromStorage) {
    const pairAddressData = JSON.parse(pairAddressListFromStorage)
    localStorage.setItem(
      'pairAddressList',
      JSON.stringify({
        ...pairAddressData,
        ...(pairAddressData[account]
          ? {
              [account]: Array.from(new Set([...pairAddressData[account], pairAddress])),
            }
          : {
              [account]: [pairAddress],
            }),
      })
    )
  } else {
    localStorage.setItem(
      'pairAddressList',
      JSON.stringify({
        [account]: [pairAddress],
      })
    )
  }
}

export const parseParams = (data: Record<string, string | number>) => {
  return Object.keys(data).reduce((pre, cur) => {
    pre += `${cur}=${data[cur]}&`
    return pre
  }, '')
}

export const findAllPaths = (
  graph: Record<string, (string | number)[]>,
  startNode: string | number,
  endNode: string | number
) => {
  const stack: any = [[startNode, [startNode]]]
  const result: (string | number)[][] = []
  while (stack.length) {
    const [currentNode, currentPath] = stack.pop()
    if (currentNode === endNode) {
      result.push(currentPath)
    } else {
      if (!graph[currentNode]) {
        return []
      }
      for (let neighbor of graph[currentNode]) {
        if (!currentPath.includes(neighbor)) {
          stack.push([neighbor, [...currentPath, neighbor]])
        }
      }
    }
  }
  return result
}

export const generateGraph = (vertexesParams: (string | number)[], edges: (string | number)[][]) => {
  const vertexes = [...vertexesParams]
  const adjList: Record<string, (string | number)[]> = {}
  const addVertex = (value: string | number) => {
    vertexes.push(value)
    adjList[value] = []
  }
  const addEdge = (value1: string | number, value2: string | number) => {
    adjList[value1].push(value2)
    adjList[value2].push(value1)
  }
  vertexesParams.map((item) => {
    addVertex(item)
  })
  edges.map((item) => {
    addEdge(item[0], item[1])
  })
  return adjList
}

export const findShortestSubArray = (array: TRoutePair[][]) => {
  let minLength = Infinity
  let shortestSubArray = null
  for (let i = 0; i < array.length; i++) {
    const subArray = array[i]
    if (subArray.length < minLength) {
      minLength = subArray.length
      shortestSubArray = subArray
    }
  }
  return shortestSubArray
}
