import styled from 'styled-components'
import VideoBg from '@/business-components/videoBg'
import React from 'react'

const Docs = () => {
  return (
    <DocsWrapper>
      <VideoBg src="https://d26w3tglonh3r.cloudfront.net/video/swap.mp4" />
      <h1>The Function Is Under Development...</h1>
    </DocsWrapper>
  )
}
const DocsWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 38vh;
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
export default Docs
