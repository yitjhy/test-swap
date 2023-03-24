import styled from 'styled-components'
import Image from 'next/image'
import CheckBox from '@/components/checkbox'
import { ConfirmBtn, CancelBtn } from '@/components/button'
import { useState, FC } from 'react'

const ExpertMode: FC<{ onTurnOnExpertMode: () => void }> = ({ onTurnOnExpertMode }) => {
  const [isShowExpertModeAgain, setIsShowExpertModeAgain] = useState(false)
  const handleTurnOnExpertMode = () => {
    const result = prompt('Please type the word "confirm" to enable expert mode.', '')
    if (result === 'confirm') {
      onTurnOnExpertMode()
    }
  }
  return (
    <ExpertModeWrapper>
      <div className="split-line" />
      <div className="tip-wrapper">
        <Image src="/warning.png" alt="" width={15} height={15} />
        <p className="tip-icon">
          Expert mode turns off the Confirm transaction prompt and allows high slippage trades that often result in bad
          rates and lost funds.
        </p>
      </div>
      <p className="description-text">Only use this mode if you know what you are doing.</p>
      {/*<CheckBox text="Dont show this again" value={isShowExpertModeAgain} onChange={setIsShowExpertModeAgain} />*/}
      <ConfirmBtn onClick={handleTurnOnExpertMode}>Turn On Expert Mode</ConfirmBtn>
      {/*<CancelBtn>Cancel</CancelBtn>*/}
    </ExpertModeWrapper>
  )
}
const ExpertModeWrapper = styled.div`
  display: grid;
  row-gap: 1.5rem;
  .split-line {
    border-top: 1px solid #262626;
  }
  .tip-wrapper {
    height: 5.3rem;
    border: 1px solid #924343;
    font-size: 14px;
    color: #d9d9d9;
    display: flex;
    column-gap: 0.8rem;
    padding: 1rem 2rem 1rem 0.5rem;
    .tip-icon {
    }
    .tip-text {
      flex: 1;
    }
  }
  .description-text {
    font-size: 14px;
    color: #d9d9d9;
  }
`
export default ExpertMode
