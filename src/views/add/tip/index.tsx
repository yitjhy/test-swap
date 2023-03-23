import Image from 'next/image'
import styled from 'styled-components'
const IncreaseTip = () => {
  return (
    <IncreaseTipWrapper>
      <Image src="/warning.png" alt="" width={15} height={15} />
      <p className="tip-text">
        Tip: When you add liquidity, you will receive pool tokens representing your position. These tokens automatically
        earn fees proportional to your share of the pool, and can be redeemed at any time.
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
