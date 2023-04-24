import styled from 'styled-components'
import { CaretDownOutlined } from '@ant-design/icons'
import { FC } from 'react'

const countMap = [
  { label: 'All Time Volume', value: '115 B+' },
  { label: 'Number of users', value: '72 K+' },
  { label: 'All Time Trades', value: '34 M' },
  { label: 'Project Partner', value: '200' },
]
const MobileView1: FC<{ onNext: (id: 'view1' | 'view2' | 'view3') => void }> = ({ onNext }) => {
  const handleNext = () => {
    onNext('view2')
  }
  return (
    <MobileView1Wrapper>
      <span className="title">HUNTERSWAP</span>
      <span className="des">The hunterswap on First-ever Game OPTIMISTIC Rollup on BSC CHAIN</span>
      <span className="des des2">
        As BSC's first ever zkRollup, Thehuterswap allows you to avoid costly gas fees and network congestion with the
        same security as mainnet - 100x cheaper and faster.
      </span>
      <div className="count-wrapper">
        {countMap.map((item, index) => {
          return (
            <div className="count-item-wrapper" key={index}>
              <div className="count-value">{item.value}</div>
              <div className="count-label">{item.label}</div>
            </div>
          )
        })}
      </div>
      <div className="next-btn">
        <CaretDownOutlined onClick={handleNext} />
      </div>
    </MobileView1Wrapper>
  )
}
const MobileView1Wrapper = styled.div`
  padding: 0 21px;
  .title {
    font-size: 24px;
    color: #ffffff;
    text-align: center;
    display: block;
  }
  .des {
    font-size: 14px;
    color: #ffffff;
    text-align: center;
    display: block;
    margin-top: 15px;
  }
  .des2 {
    font-size: 12px;
    margin-top: 27px;
  }
  .count-wrapper {
    margin-top: 84px;
    display: grid;
    grid-template-columns: repeat(auto-fill, 45%);
    grid-gap: 10px;
    row-gap: 33px;
    justify-content: center;
    .count-item-wrapper {
      display: grid;
      color: #ffffff;
      row-gap: 10px;
      .count-value {
        font-size: 20px;
        text-align: center;
      }
      .count-label {
        font-size: 14px;
        text-align: center;
      }
    }
  }
  .next-btn {
    position: fixed;
    bottom: 35px;
    color: #fff;
    font-size: 30px;
    left: 50%;
    transform: translateX(-50%);
  }
`
export default MobileView1
