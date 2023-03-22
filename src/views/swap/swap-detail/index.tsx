import { HelpCircle } from 'react-feather'
import styled from 'styled-components'
import React, { FC, useState } from 'react'
import Popover from '@/components/popover'
import { SwapLock } from '@/hooks/useSwapRouter'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'

type TSwapDetail = {
  lock: SwapLock
  maxIn: BigNumber
  minOut: BigNumber
  currentSlippage: number
  outAmount: string
  inSymbol: string
  inDecimals: number
  outSymbol: string
  outDecimals: number
  slippage: number
}
const SwapDetail: FC<TSwapDetail> = ({
  lock,
  maxIn,
  minOut,
  currentSlippage,
  outAmount,
  inSymbol,
  inDecimals,
  outSymbol,
  outDecimals,
  slippage,
}) => {
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
                    The amount you expect to receive at the current market price. You may receive less or more if the
                    market price changes while your transaction is pending.
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
          <span className="price-detal-item-value">
            {outAmount} {outSymbol}
          </span>
        </div>
      </div>
      <div>
        <div className="price-detal-item-wrapper">
          <span className="price-detal-item-label">
            <span className="label-text">Price Impact</span>
            <span className="label-tip">
              <Popover
                content={<span className="tip-text">The impact your trade has on the market price of this pool.</span>}
                triger={
                  <span style={{ display: 'flex' }}>
                    <HelpCircle size={16} />
                  </span>
                }
              />
            </span>
          </span>
          <span className="price-detal-item-value">{currentSlippage / 100} %</span>
        </div>
      </div>
      {lock === SwapLock.In && (
        <div>
          <div className="price-detal-item-wrapper">
            <span className="price-detal-item-label">
              <span className="label-text">Minimum received after slippage ({slippage / 100}%)</span>
              <span className="label-tip">
                <Popover
                  content={
                    <span className="tip-text">
                      The minimum amount you are guaranteed to receive. If the price slips any further, your transaction
                      will revert.
                    </span>
                  }
                  triger={
                    <span style={{ display: 'flex' }}>
                      <HelpCircle size={16} />
                    </span>
                  }
                  placement="topCenter"
                />
              </span>
            </span>
            <span className="price-detal-item-value">
              {formatUnits(minOut, outDecimals)} {outSymbol}
            </span>
          </div>
        </div>
      )}
      {lock === SwapLock.Out && (
        <div>
          <div className="price-detal-item-wrapper">
            <span className="price-detal-item-label">
              <span className="label-text">Max output after slippage ({slippage / 100}%)</span>
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
            <span className="price-detal-item-value">
              {formatUnits(maxIn, inDecimals)} {inSymbol}
            </span>
          </div>
        </div>
      )}

      {/*<div>*/}
      {/*  <div className="price-detal-item-wrapper">*/}
      {/*    <span className="price-detal-item-label">*/}
      {/*      <span className="label-text">Network Fee</span>*/}
      {/*      <span className="label-tip">*/}
      {/*        <Popover*/}
      {/*          content={*/}
      {/*            <span className="tip-text">*/}
      {/*              Setting a high slippage tolerance can help transactions succeed, but you may not get such a good*/}
      {/*              price. Use with caution.*/}
      {/*            </span>*/}
      {/*          }*/}
      {/*          triger={*/}
      {/*            <span style={{ display: 'flex' }}>*/}
      {/*              <HelpCircle size={16} />*/}
      {/*            </span>*/}
      {/*          }*/}
      {/*        />*/}
      {/*      </span>*/}
      {/*    </span>*/}
      {/*    <span className="price-detal-item-value">~$ 0.002</span>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </SwapDetailWrapper>
  )
}
const SwapDetailWrapper = styled.div<{ isExpand: boolean }>`
  padding: 0.3rem 0.7rem;
  padding-bottom: 50px;
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
          font-weight: lighter;
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
