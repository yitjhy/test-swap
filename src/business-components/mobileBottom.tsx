import React from 'react'
import styled from 'styled-components'

const MobileBottom = () => {
  return (
    <BottomWrapper>
      <div className="btn-group">
        <img
          src="/images/common/twitter.svg"
          alt=""
          onClick={() => {
            window.open('https://twitter.com/Hunterswap2023', '__blank')
          }}
        />
        <img
          src="/images/common/telegram.svg"
          alt=""
          onClick={() => {
            window.open('https://t.me/hunter_swap', '__blank')
          }}
        />
      </div>
      <div className="split-line" />
      <div className="copyRight">©2023 HunterSwap . All Rights Reserved</div>
    </BottomWrapper>
  )
}
const BottomWrapper = styled.div`
  margin-bottom: 18px;
  margin-top: 50px;
  .btn-group {
    display: flex;
    column-gap: 12px;
  }
  .split-line {
    margin: 15px 0;
    border-bottom: 1px solid #9c9c9c;
  }
  .copyRight {
    width: 100%;
    text-align: center;
    font-size: 13px;
    color: #aaaaaa;
  }
`
export default MobileBottom
