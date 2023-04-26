// export enum contractAddress {
//   'factory' = '0x06b77FA72e62DBfB025eCe979f76C68F5A0a2fC3',
//   'router' = '0x8293D60aF9B9393CAC06c1Bf58CA1DcF9d29442B',
//   'weth' = '0xc771287bC4a851e6fA49a349701539DBC92c7AaF',
// }
import { constants } from 'ethers'
import { Chain } from '@/types/enum'

// export enum contractAddress {
//   'factory' = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
//   'router' = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
//   'weth' = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
// }
export enum contractAddress {
  'factory' = '0x55eDb288D477392e69092f375f382142210d7Af4',
  'router' = '0xADaE51D4427BEd402F380854f08dAC295E3A8BD1',
  'weth' = '0xe5e663B43ba66e8D7128b92097D96Fe699B005b7',
}
export const invalidAddress = constants.AddressZero
export const platFormAddress = constants.AddressZero

export const platformCurrencyData = {
  name: 'HUNTERS',
  symbol: 'ETH',
  decimals: 18,
  address: platFormAddress,
}
export const chainId = Chain.COMBOTest
