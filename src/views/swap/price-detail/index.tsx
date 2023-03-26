import { RefreshCw, AlertCircle } from 'react-feather'
import styled from 'styled-components'
import Popover from '@/components/popover'
import { FC, useState } from 'react'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { cutOffStr } from '@/utils'

type TPriceDetailProps = {
  rate: number
  from: string
  to: string
  outDecimals: number
  inDecimals: number
}
const PriceDetail: FC<TPriceDetailProps> = ({ rate, from, to, inDecimals, outDecimals }) => {
  const [isReversePrice, setIsReversePrice] = useState(false)
  // const reverseRate = parseUnits('1', outDecimals).div(parseUnits(String(rate), outDecimals))
  // const reverseRate = 1 / rate
  // const reverseRate = parseUnits('1', 16)
  //   .div(parseUnits(String(rate), outDecimals))
  //   .div(parseUnits('1', 16))
  // console.log(cutOffStr(String(reverseRate), outDecimals))
  // console.log(formatUnits('0.452942', 7))
  const handleReversePrice = () => {
    setIsReversePrice(!isReversePrice)
  }
  return (
    <PriceDetailWrapper>
      <div className="price-label">
        <span className="label-text">Price</span>
        {/*<span className="label-tip">*/}
        {/*  <Popover*/}
        {/*    content={<span className="tip-text">如果兑换率超过百分百,则将还原该交易</span>}*/}
        {/*    triger={*/}
        {/*      <span style={{ display: 'flex' }}>*/}
        {/*        <AlertCircle size={15} color="#9c9c9c" />*/}
        {/*      </span>*/}
        {/*    }*/}
        {/*  />*/}
        {/*</span>*/}
      </div>
      <div className="price-value">
        <span className="value" onClick={handleReversePrice}>
          1 {isReversePrice ? to : from} ≈{' '}
          {isReversePrice ? cutOffStr(String(1 / rate), 6) : cutOffStr(String(rate), 6)} {isReversePrice ? from : to}
        </span>
        {/*<RefreshCw color="#9C9C9C" size={15} cursor="pointer" />*/}
      </div>
    </PriceDetailWrapper>
  )
}

const PriceDetailWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  color: #fefefe;
  margin-top: 2px;
  padding: 18px 18px;
  background: #262626;
  .price-label {
    display: flex;
    align-items: center;
    .label-text {
      font-weight: 400;
      margin-right: 8px;
      color: #9c9c9c;
      font-size: 14px;
    }
    .label-tip {
      .tip-text {
        font-size: 10px;
      }
    }
  }
  .price-value {
    display: flex;
    align-items: center;
    .value {
      color: #fefefe;
      font-size: 14px;
      margin-right: 8px;
    }
  }
`
export default PriceDetail
