import styled from 'styled-components'

const Bridge = () => {
  return (
    <BridgeWrapper>
      <h1>功能开发中，敬请期待...</h1>
    </BridgeWrapper>
  )
}
const BridgeWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 28vh;
  h1 {
    font-size: 100px;
    user-select: none;
    animation: wave 2s infinite;
    @keyframes wave {
      0% {
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  }
`
export default Bridge
