import styled from 'styled-components'
import VideoBg from '@/business-components/videoBg'
import React from 'react'

const Bridge = () => {
  return (
    <BridgeWrapper>
      <VideoBg src="https://cdn.name3.net/video/liquidity.mp4" />
      <h1>The Function Is Under Development...</h1>
    </BridgeWrapper>
  )
}
const BridgeWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 28vh;
  h1 {
    font-size: 80px;
    user-select: none;
    animation: wave 2s infinite;
    z-index: 5;
    position: relative;
    opacity: 0.5;
    @keyframes wave {
      0% {
        opacity: 0;
      }
      50% {
        opacity: 0.5;
      }
      100% {
        opacity: 0;
      }
    }
  }
`
export default Bridge
