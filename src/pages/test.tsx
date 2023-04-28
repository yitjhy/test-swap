// import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client'
import { useQuery, gql } from '@apollo/client'
import useRoute2 from '@/hooks/useRoute2'
import { ExactType } from '@/hooks/useRoutes'
import { parseUnits } from 'ethers/lib/utils'

const GET_LOCATIONS = gql`
  query {
    pairs {
      id
      totalSupply
      reserve0
      reserve1
      token0 {
        id
        name
        symbol
        decimals
      }
      token1 {
        id
        name
        symbol
        decimals
      }
    }
  }
`
const USDTID = '0x00cc1d4a5dc22c0b316f11e0db442c2e60d6d47f'
const BToken = '0xaa8ee3e37ab5b3eb5bbc49ff5ab9a6d486ac5a92'
const AToken = '0x80e3ee285fe34a3a5592f3421c426743d17c9eed'
const Test = () => {
  // const { loading, error, data, refetch } = useQuery(GET_LOCATIONS)
  const { routes } = useRoute2(BToken, USDTID, '0.011', ExactType.exactOut)
  // const { routes } = useRoute2(BToken, AToken, '1', ExactType.exactOut)
  // const { routes } = useRoute2(USDTID, AToken)
  console.log(routes)
  return <></>
}
export default Test
