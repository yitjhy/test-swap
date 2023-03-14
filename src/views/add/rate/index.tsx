import styled from 'styled-components'
import { TCurrencyListItem } from '@/context/remoteCurrencyListContext'
import { FC } from 'react'

type TRateProps = {
  fromCurrency: TCurrencyListItem
  toCurrency: TCurrencyListItem
  rateFrom2To: string
  rateTo2From: string
  shareOfPool: number
}
const Rate: FC<TRateProps> = ({ fromCurrency, toCurrency, shareOfPool, rateFrom2To, rateTo2From }) => {
  return (
    <RateWrapper>
      <span className="rate-title">Prices and pool share</span>
      <div className="rate-detail-wrapper">
        <div className="rate-detail-item-wrapper">
          <span className="rate-value">{rateFrom2To}</span>
          <span className="rate-label">
            {fromCurrency?.symbol?.slice(0, 3)} per {toCurrency?.symbol?.slice(0, 3)}
          </span>
        </div>
        <div className="rate-detail-item-wrapper">
          <span className="rate-value">{rateTo2From}</span>
          <span className="rate-label">
            {toCurrency?.symbol?.slice(0, 3)} per {fromCurrency?.symbol?.slice(0, 3)}
          </span>
        </div>
        <div className="rate-detail-item-wrapper">
          <span className="rate-value">{shareOfPool}%</span>
          <span className="rate-label">Share of pool</span>
        </div>
      </div>
    </RateWrapper>
  )
}
const RateWrapper = styled.div`
  font-size: 14px;
  color: #9c9c9c;
  margin-top: 1rem;
  margin-left: 1rem;
  .rate-title {
  }
  .rate-detail-wrapper {
    padding: 0 3rem;
    display: flex;
    margin-top: 35px;
    justify-content: space-between;
    .rate-detail-item-wrapper {
      display: grid;
      row-gap: 8px;
      .rate-value {
        color: #fefefe;
        display: block;
        text-align: center;
      }
      .rate-label {
        font-size: 12px;
        display: block;
        text-transform: lowercase;
      }
    }
  }
`
export default Rate
