import styled from 'styled-components'

const Docs = () => {
  return (
    <DocsWrapper>
      <h1>The Function Is Under Development...</h1>
    </DocsWrapper>
  )
}
const DocsWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 28vh;
  h1 {
    font-size: 80px;
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
export default Docs
