import Graphemer from 'graphemer'

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
