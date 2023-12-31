import styled from 'styled-components'
import { FC } from 'react'
import { formatUnits } from 'ethers/lib/utils'
import { Global } from '@/types/global'
import { getStrByDecimalPlaces } from '@/utils'

export type TRateProps = {
  rate: Global.TPairInfo['rate']
  shareOfPool: string
}

const Rate: FC<TRateProps> = ({ rate, shareOfPool }) => {
  return (
    <RateWrapper>
      <span className="rate-title">Prices and pool share</span>
      <div className="rate-detail-wrapper">
        {rate.map((item, index) => {
          return (
            <div className="rate-detail-item-wrapper" key={index}>
              <span className="rate-value">
                {getStrByDecimalPlaces(formatUnits(item.rate, item.toCurrency.decimals))}
              </span>
              <span className="rate-label">
                <span className="token">{item.fromCurrency?.symbol}</span> per{' '}
                <span className="token">{item.toCurrency?.symbol}</span>
              </span>
            </div>
          )
        })}
        <div className="rate-detail-item-wrapper">
          <span className="rate-value">{getStrByDecimalPlaces(String(shareOfPool))}%</span>
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
    padding: 0 2rem;
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
        text-align: center;
        .token {
          text-transform: uppercase;
        }
      }
    }
  }
`
export default Rate
