import styled from 'styled-components'
import { CaretDownOutlined, CaretRightOutlined, CaretUpOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import { FC } from 'react'

type TMobileView2 = {
  onNext: (id: 'view1' | 'view2' | 'view3') => void
  onPre: (id: 'view1' | 'view2' | 'view3') => void
}
const MobileView2: FC<TMobileView2> = ({ onNext, onPre }) => {
  const router = useRouter()
  const handleNext = () => {
    onNext('view3')
  }
  const handlePre = () => {
    onPre('view1')
  }
  return (
    <MobileView1Wrapper>
      <span className="title">Millisecond Speed</span>
      <span className="des">
        The TPS can be increased by multiple orders of magnitude. While users enjoy a smooth transaction experience
      </span>
      <div
        className="swap"
        onClick={() => {
          router.push('/swap').then()
        }}
      >
        SWAP <CaretRightOutlined style={{ fontSize: 10, marginLeft: 15 }} />
      </div>
      <div className="next-btn">
        <CaretDownOutlined onClick={handleNext} />
      </div>
      <div className="pre-btn">
        <CaretUpOutlined onClick={handlePre} />
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
    font-size: 12px;
    color: #ffffff;
    text-align: left;
    display: block;
    margin-top: 17px;
  }
  .swap {
    justify-content: center;
    align-items: center;
    width: 165px;
    margin-top: 34px;
    border: 1px solid #ffffff;
    padding: 8px 22px;
    font-size: 25px;
    cursor: pointer;
    display: flex;
    margin-left: 50%;
    transform: translateX(-50%);
  }
  .next-btn {
    position: fixed;
    bottom: 35px;
    color: #fff;
    font-size: 30px;
    left: 50%;
    transform: translateX(-50%);
  }
  .pre-btn {
    position: fixed;
    bottom: 75px;
    color: #fff;
    font-size: 30px;
    right: 30px;
  }
`
export default MobileView2
