import { useRouter } from 'next/router'
import styled from 'styled-components'
import { ConfirmBtn } from '@/components/button'
import { BigNumber } from 'ethers'
import { FC } from 'react'
import { formatUnits } from 'ethers/lib/utils'

export type TPairDetail = {
  accountPairBalance: BigNumber
  pairDecimals: number
  LPShare: BigNumber
  pairAddress: string
  tokens: { symbol: string; decimals: number; balance: BigNumber }[]
}
const PairDetail: FC<{ data: TPairDetail }> = ({ data }) => {
  const router = useRouter()
  const goIncreaseLP = () => {
    router.push('/add')
  }

  return (
    <LPDetailWrapper>
      <div className="lp-detail-item-wrapper">
        <div className="lp-detail-item-label">Your total pool tokens：</div>
        <div className="lp-detail-item-value">{formatUnits(data.accountPairBalance, data.pairDecimals)}</div>
      </div>
      <>
        {data.tokens.map((item, index) => {
          return (
            <div className="lp-detail-item-wrapper" key={index}>
              <div className="lp-detail-item-label">Pooled {item.symbol}:</div>
              <div className="lp-detail-item-value">{formatUnits(item.balance, item.decimals)}</div>
            </div>
          )
        })}
      </>
      <div className="lp-detail-item-wrapper">
        <div className="lp-detail-item-label">Your pool share:</div>
        <div className="lp-detail-item-value">{formatUnits(data.LPShare, 4)}%</div>
      </div>
      <div className="operation-wrapper">
        <ConfirmBtn style={{ padding: '0 27px', height: '2.5rem' }} onClick={goIncreaseLP}>
          Add
        </ConfirmBtn>
        <ConfirmBtn
          style={{ padding: '0 27px', height: '2.5rem' }}
          onClick={() => {
            router.push(`/remove?address=${data.pairAddress}`)
          }}
        >
          Remove
        </ConfirmBtn>
      </div>
    </LPDetailWrapper>
  )
}
const LPDetailWrapper = styled.div`
  padding: 36px 61px 21px;
  color: #fefefe;
  display: grid;
  row-gap: 1.5rem;
  font-size: 14px;
  background: #262626;
  .lp-detail-item-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .lp-detail-item-label {
      user-select: none;
    }
    .lp-detail-item-value {
    }
  }
  .operation-wrapper {
    display: flex;
    column-gap: 0.8rem;
    justify-content: end;
  }
`
export default PairDetail
