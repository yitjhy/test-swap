import styled from 'styled-components'

const Rate = () => {
  return (
    <RateWrapper>
      <span className="rate-title">Prices and pool share</span>
      <div className="rate-detail-wrapper">
        <div className="rate-detail-item-wrapper">
          <span className="rate-value">15.2618</span>
          <span className="rate-label">USDT per ETH</span>
        </div>
        <div className="rate-detail-item-wrapper">
          <span className="rate-value">0.261811</span>
          <span className="rate-label">ETH per USDT</span>
        </div>
        <div className="rate-detail-item-wrapper">
          <span className="rate-value">25.89%</span>
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
      }
    }
  }
`
export default Rate
