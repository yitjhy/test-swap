import React, { FC } from 'react'
import styled from 'styled-components'

const VideoBg: FC<{ src: string }> = ({ src }) => {
  return (
    <VideoWrapper>
      <video controls={false} muted autoPlay loop>
        <source src={src} type="video/mp4" />
      </video>
    </VideoWrapper>
  )
}
const VideoWrapper = styled.div`
  position: fixed;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  //background: red;
  left: 0;
  top: 0;
  video {
    width: 100%;
    height: 100%;
    object-fit: fill;
  }
`
export default VideoBg
