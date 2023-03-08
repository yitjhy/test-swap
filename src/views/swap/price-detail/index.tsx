import { RefreshCw, AlertCircle } from 'react-feather'
import styled from 'styled-components'
import Popover from '@/components/popover'

const PriceDetail = () => {
  return (
    <PriceDetailWrapper>
      <div className="price-label">
        <span className="label-text">Price</span>
        <span className="label-tip">
          <Popover
            content={<span className="tip-text">如果兑换率超过百分百,则将还原该交易</span>}
            triger={
              <span style={{ display: 'flex' }}>
                <AlertCircle size={15} color="#9c9c9c" />
              </span>
            }
          />
        </span>
      </div>
      <div className="price-value">
        <span className="value">1 USDT ≈ 0.00064 ETH</span>
        <RefreshCw color="#9C9C9C" size={15} cursor="pointer" />
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
