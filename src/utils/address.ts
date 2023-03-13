import { isAddress } from 'ethers/lib/utils'

export function isSameAddress(address1: string | undefined | null, address2: string | undefined | null) {
  if (!address1 || !address2 || !isAddress(address1) || !isAddress(address2)) return false
  return address1.toLowerCase() === address2.toLowerCase()
}

export function shortenAddress(address?: string, chars = 4) {
  if (!address || !isAddress(address)) return address
  return address.slice(0, chars + 2) + '...' + address.slice(42 - chars)
}
