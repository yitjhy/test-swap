import styled from 'styled-components'
import { ConfirmBtn } from '@/components/button'

const LPDetail = () => {
  return (
    <LPDetailWrapper>
      <div className="lp-detail-item-wrapper">
        <div className="lp-detail-item-label">Your total pool tokens：</div>
        <div className="lp-detail-item-value">0.1004665</div>
      </div>
      <div className="lp-detail-item-wrapper">
        <div className="lp-detail-item-label">Pooled USDT:</div>
        <div className="lp-detail-item-value">0.1004665</div>
      </div>
      <div className="lp-detail-item-wrapper">
        <div className="lp-detail-item-label">Pooled ETH:</div>
        <div className="lp-detail-item-value">0.000111</div>
      </div>
      <div className="lp-detail-item-wrapper">
        <div className="lp-detail-item-label">Your pool share:</div>
        <div className="lp-detail-item-value">0.001%</div>
      </div>
      <div className="operation-wrapper">
        <ConfirmBtn style={{ padding: '0 27px', height: '2.5rem' }}>Add</ConfirmBtn>
        <ConfirmBtn style={{ padding: '0 27px', height: '2.5rem' }}>Remove</ConfirmBtn>
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
export default LPDetail
