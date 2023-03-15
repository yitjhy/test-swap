import styled from 'styled-components'
import { TCurrencyListItem } from '@/context/remoteCurrencyListContext'
import { FC } from 'react'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'

export type RateItem = {
  rate: BigNumber | any
  fromCurrency: TCurrencyListItem
  toCurrency: TCurrencyListItem
}
export type TRateProps = {
  rate: [RateItem, RateItem]
  shareOfPool: number
}

const getStrByDecimalPlaces = (val: string, decimalPlaces = 4) => {
  if (val.includes('.')) {
    const arr = val.split('.')
    return arr[0] + '.' + arr[1].slice(0, decimalPlaces)
  } else {
    return val
  }
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
                {item.fromCurrency?.symbol?.slice(0, 3)} per {item.toCurrency?.symbol?.slice(0, 3)}
              </span>
            </div>
          )
        })}
        {/*<div className="rate-detail-item-wrapper">*/}
        {/*  <span className="rate-value">{getStrByDecimalPlaces(formatUnits(rateFrom2To, 18))}</span>*/}
        {/*  <span className="rate-label">*/}
        {/*    {fromCurrency?.symbol?.slice(0, 3)} per {toCurrency?.symbol?.slice(0, 3)}*/}
        {/*  </span>*/}
        {/*</div>*/}
        {/*<div className="rate-detail-item-wrapper">*/}
        {/*  <span className="rate-value">{getStrByDecimalPlaces(formatUnits(rateTo2From, 18))}</span>*/}
        {/*  <span className="rate-label">*/}
        {/*    {toCurrency?.symbol?.slice(0, 3)} per {fromCurrency?.symbol?.slice(0, 3)}*/}
        {/*  </span>*/}
        {/*</div>*/}
        <div className="rate-detail-item-wrapper">
          <span className="rate-value">{getStrByDecimalPlaces(String(shareOfPool * 100))}%</span>
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
