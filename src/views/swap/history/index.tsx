import styled from 'styled-components'
import Modal from '@/components/modal'
import { useState, FC, useEffect, useRef } from 'react'
import ExpertModeCom from '@/views/swap/config/expertMode'
import { SwapLock } from '@/hooks/useSwapRouter'
import { CloseOutlined } from '@ant-design/icons'

type THistory = {
  isShow: boolean
}
type TSwapTransHistory = {
  lock: SwapLock.In
  inAmount: string
  outAmount: string
  inSymbol: string
  outSymbol: string
  transHash: string
}
const History: FC<THistory> = ({ isShow }) => {
  const [swapTransHistory, setSwapTransHistory] = useState<TSwapTransHistory[]>([])
  const clearItemTrans = (transHash: string) => {
    const res = swapTransHistory.filter((item) => item.transHash !== transHash)
    setSwapTransHistory(res)
    localStorage.setItem('swapTransHistory', JSON.stringify(res))
  }
  const clearAllTransHash = () => {
    setSwapTransHistory([])
    localStorage.setItem('swapTransHistory', JSON.stringify([]))
  }
  useEffect(() => {
    const swapTransHistoryStr = localStorage.getItem('swapTransHistory')
    if (swapTransHistoryStr) {
      const swapTransHistory = JSON.parse(swapTransHistoryStr)
      if (swapTransHistory && swapTransHistory.length) {
        setSwapTransHistory(swapTransHistory)
      }
    }
  }, [isShow])
  return (
    <ConfigWrapper>
      <div className="split-line" />
      <div className="header">
        <span className="chain-name">Combo Test-Network</span>
        <span
          className="clear"
          onClick={() => {
            clearAllTransHash()
          }}
        >
          Clear All
        </span>
      </div>
      <div className="transHistory">
        {swapTransHistory.map((item, index) => {
          return (
            <div className="trans-item-wrapper" key={index}>
              <div
                className="trans-text"
                onClick={() => {
                  window.open(`https://combotrace-testnet.nodereal.io/tx/${item.transHash}`, '__blank')
                }}
              >
                {item.lock === SwapLock.In
                  ? `Swap max. ${item.outAmount} ${item.outSymbol} for ${item.inAmount} ${item.inSymbol}`
                  : `Swap ${item.outAmount} ${item.outSymbol} for min. ${item.inAmount} ${item.inSymbol}`}
              </div>
              <div
                className="clear-item"
                onClick={() => {
                  clearItemTrans(item.transHash)
                }}
              >
                <CloseOutlined />
              </div>
            </div>
          )
        })}
      </div>
      {swapTransHistory.length === 0 && <span className="no-data">No recent transactions</span>}
    </ConfigWrapper>
  )
}
const ConfigWrapper = styled.div`
  display: grid;
  grid-auto-rows: auto;
  row-gap: 25px;
  color: #d9d9d9;
  font-size: 14px;
  padding-bottom: 0.8rem;
  .split-line {
    border-top: 1px solid #262626;
  }
  .header {
    display: flex;
    justify-content: space-between;
    .clear {
      cursor: pointer;
    }
  }
  .transHistory {
    display: grid;
    row-gap: 20px;
    max-height: 400px;
    overflow-y: auto;
    .trans-item-wrapper {
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      .trans-text {
        cursor: pointer;
        color: #9c9c9c;
      }
      .clear-item {
        font-size: 13px;
        cursor: pointer;
        color: #9c9c9c;
      }
    }
  }
  .config-title {
    font-weight: bolder;
    font-size: 16px;
  }
  .no-data {
    font-size: 16px;
    color: #d9d9d9;
    padding: 4rem 0;
    display: block;
    text-align: center;
  }
`
export default History
