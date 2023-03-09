import { HelpCircle } from 'react-feather'
import styled from 'styled-components'
import React, { useState } from 'react'
import Popover from '@/components/popover'

const SwapDetail = () => {
  const [isPriceDetailExpand, setIsPriceDetailExpand] = useState(true)
  return (
    <SwapDetailWrapper isExpand={isPriceDetailExpand}>
      {/* <div className="arrow-wrapper">
        <HeaderArrowIcon isExpand={isPriceDetailExpand} onClick={() => setIsPriceDetailExpand(!isPriceDetailExpand)}>
          &#9650;
        </HeaderArrowIcon>
      </div> */}
      <div>
        <div className="price-detal-item-wrapper">
          <span className="price-detal-item-label">
            <span className="label-text">Expected Output</span>
            <span className="label-tip">
              <Popover
                content={
                  <span className="tip-text">
                    Setting a high slippage tolerance can help transactions succeed, but you may not get such a good
                    price. Use with caution.
                  </span>
                }
                triger={
                  <span style={{ display: 'flex' }}>
                    <HelpCircle size={16} />
                  </span>
                }
              />
            </span>
          </span>
          <span className="price-detal-item-value">1564 USDT</span>
        </div>
      </div>
      <div>
        <div className="price-detal-item-wrapper">
          <span className="price-detal-item-label">
            <span className="label-text">Price Impact</span>
            <span className="label-tip">
              <Popover
                content={
                  <span className="tip-text">
                    Setting a high slippage tolerance can help transactions succeed, but you may not get such a good
                    price. Use with caution.
                  </span>
                }
                triger={
                  <span style={{ display: 'flex' }}>
                    <HelpCircle size={16} />
                  </span>
                }
              />
            </span>
          </span>
          <span className="price-detal-item-value">26.18 %</span>
        </div>
      </div>
      <div>
        <div className="price-detal-item-wrapper">
          <span className="price-detal-item-label">
            <span className="label-text">Minimum received after slippage (0.50%)</span>
            <span className="label-tip">
              <Popover
                content={
                  <span className="tip-text">
                    Setting a high slippage tolerance can help transactions succeed, but you may not get such a good
                    price. Use with caution.
                  </span>
                }
                triger={
                  <span style={{ display: 'flex' }}>
                    <HelpCircle size={16} />
                  </span>
                }
              />
            </span>
          </span>
          <span className="price-detal-item-value">2.1122 USDT</span>
        </div>
      </div>
      <div>
        <div className="price-detal-item-wrapper">
          <span className="price-detal-item-label">
            <span className="label-text">Network Fee</span>
            <span className="label-tip">
              <Popover
                content={
                  <span className="tip-text">
                    Setting a high slippage tolerance can help transactions succeed, but you may not get such a good
                    price. Use with caution.
                  </span>
                }
                triger={
                  <span style={{ display: 'flex' }}>
                    <HelpCircle size={16} />
                  </span>
                }
              />
            </span>
          </span>
          <span className="price-detal-item-value">~$ 0.002</span>
        </div>
      </div>
    </SwapDetailWrapper>
  )
}
const SwapDetailWrapper = styled.div<{ isExpand: boolean }>`
  padding: 0.3rem 0.7rem;
  margin-top: 20px;
  display: grid;
  row-gap: 20px;
  /* height: ${({ isExpand }) => (isExpand ? '197px' : '25px')}; */
  /* opacity: ${({ isExpand }) => (isExpand ? 1 : 0)}; */
  transition: all linear 0.15s;
  overflow: hidden;
  width: 100%;
  .arrow-wrapper {
    display: flex;
    justify-content: flex-end;
  }
  .price-detal-item-wrapper {
    display: flex;
    justify-content: space-between;
    color: #fefefe;
    font-size: 14px;
    .price-detal-item-label {
      display: flex;
      row-gap: 5px;
      align-items: center;
      .label-text {
        font-weight: 400;
        margin-right: 8px;
      }
      .label-tip {
        .tip-text {
          display: block;
          background: #191919;
          font-size: 8px;
          width: 200px;
          word-wrap: break-word;
          word-break: break-all;
          white-space: pre-wrap;
          padding: 3px;
        }
      }
    }
    .price-detal-item-value {
    }
  }
`
const HeaderArrowIcon = styled.span<{ isExpand: boolean }>`
  color: #d9d9d9;
  cursor: pointer;
  display: inline;
  transition: all cubic-bezier(0.39, 0.58, 0.57, 1) 0.2s;
  user-select: none;
  /* transform-origin: 50% 50%; */
  transform: ${({ isExpand }) => (isExpand ? 'rotate(180deg)' : 'rotate(0deg)')};
`
export default SwapDetail
