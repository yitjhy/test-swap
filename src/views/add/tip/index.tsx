import Image from 'next/image'
import styled from 'styled-components'
const IncreaseTip = () => {
  return (
    <IncreaseTipWrapper>
      <Image src="/warning.png" alt="" width={15} height={15} />
      <p className="tip-text">
        Expert mode turns off the Confirm transaction prompt, and allows high slippage trades that often result in bad
        rates and lost funds.
      </p>
    </IncreaseTipWrapper>
  )
}
const IncreaseTipWrapper = styled.div`
  display: flex;
  column-gap: 10px;
  margin: 28px 1rem 0;
  .tip-text {
    font-size: 0.75rem;
    color: #9c9c9c;
  }
`
export default IncreaseTip
