import styled from 'styled-components'
import Popover from '@/components/popover'
import { HelpCircle } from 'react-feather'
import Switch from '@/components/switch'
import Modal from '@/components/modal'
import { useState, FC, ChangeEvent } from 'react'
import ExpertModeCom from '@/views/swap/config/expertMode'

export type TConfig = {
  onSlippageChange: (value: number) => void
  onDeadlineChange: (value: number) => void
}
const Config: FC<TConfig> = ({ onSlippageChange, onDeadlineChange }) => {
  const [isExpertModeModalOpen, handleExpertModeModalOpen] = useState(false)
  const [configData, setConfigData] = useState<{ isExpertMode: boolean }>({ isExpertMode: false })
  const [slippage, setSlippage] = useState<number>(0.5)
  const handleSlippageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSlippage(Number(e.target.value))
    onSlippageChange(Number(e.target.value))
  }
  return (
    <ConfigWrapper>
      <Modal
        contentStyle={{ width: 480 }}
        title="Expert Mode"
        content={<ExpertModeCom />}
        open={isExpertModeModalOpen}
        onClose={handleExpertModeModalOpen}
      />
      <div className="split-line" />
      <ConfigItemWrapper>
        <ConfigLabelWrapper>
          <span className="label-text">Slippage Tolerance</span>
          <span className="label-tip">
            <Popover
              content={<span className="tip-text">如果兑换率超过百分百,则将还原该交易</span>}
              triger={
                <span style={{ display: 'flex' }}>
                  <HelpCircle size={16} />
                </span>
              }
            />
          </span>
        </ConfigLabelWrapper>
        <ConfigValueWrapper>
          <SlippageToleranceBtn>0.1%</SlippageToleranceBtn>
          <SlippageToleranceBtn>0.5%</SlippageToleranceBtn>
          <SlippageToleranceBtn>1.0%</SlippageToleranceBtn>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <InputWrapper>
              <InputNumber placeholder="0.50" onChange={handleSlippageChange} value={slippage} />
            </InputWrapper>
            <span className="unit">&nbsp;%</span>
          </span>
        </ConfigValueWrapper>
      </ConfigItemWrapper>
      <ConfigItemWrapper>
        <ExpertMode>
          <ConfigLabelWrapper>
            <span className="label-text">Tx Deadline (mins)</span>
            <span className="label-tip">
              <Popover
                content={<span className="tip-text">如果兑换率超过百分百,则将还原该交易</span>}
                triger={
                  <span style={{ display: 'flex' }}>
                    <HelpCircle size={16} />
                  </span>
                }
              />
            </span>
          </ConfigLabelWrapper>
          <ConfigValueWrapper style={{ justifyContent: 'start' }}>
            <InputWrapper>
              <InputNumber placeholder="30" />
            </InputWrapper>
          </ConfigValueWrapper>
        </ExpertMode>
      </ConfigItemWrapper>
      <ConfigItemWrapper>
        <ExpertMode>
          <ConfigLabelWrapper>
            <span className="label-text">Expert Mode</span>
            <span className="label-tip">
              <Popover
                content={
                  <span className="tip-text">
                    Setting a high slippage tolerance can help transactions succeed, but you may not get such a good
                    price. Use with caution.
                  </span>
                }
                triger={
                  <span style={{ display: 'flex' }}>
                    <HelpCircle size={16} />
                  </span>
                }
              />
            </span>
          </ConfigLabelWrapper>
          <div style={{ paddingRight: '2rem' }}>
            <Switch
              checked={configData.isExpertMode}
              onChange={(isExpertMode) => {
                if (isExpertMode) handleExpertModeModalOpen(true)
                setConfigData({ ...configData, isExpertMode })
              }}
            />
          </div>
        </ExpertMode>
      </ConfigItemWrapper>
    </ConfigWrapper>
  )
}
const SlippageToleranceBtn = styled.button`
  border: none;
  outline: none;
  height: 2rem;
  width: 5.44rem;
  background: #262626;
  color: #d9d9d9;
  font-size: 13px;
`
const ConfigWrapper = styled.div`
  display: grid;
  grid-auto-rows: auto;
  row-gap: 25px;
  color: #d9d9d9;
  font-size: 14px;
  padding-bottom: 2rem;
  .split-line {
    border-top: 1px solid #262626;
  }
  .config-title {
    font-weight: 600;
    font-weight: bolder;
    font-size: 16px;
  }
`
const ConfigItemWrapper = styled.div`
  display: grid;
  grid-auto-rows: auto;
  row-gap: 1.125rem;
`
const ConfigLabelWrapper = styled.span`
  display: flex;
  align-items: center;
  .label-text {
    font-weight: 400;
    margin-right: 8px;
  }
  .label-tip {
    .tip-text {
      display: block;
      background: #191919;
      font-size: 8px;
      width: 200px;
      word-wrap: break-word;
      word-break: break-all;
      white-space: pre-wrap;
      padding: 3px;
    }
  }
`
const ConfigValueWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 2rem;
  .unit {
    position: absolute;
    margin-left: 0.6rem;
    padding-right: 1rem;
    font-size: 13px;
    color: #d9d9d9;
    right: 0;
    transform: translateX(100%);
  }
`
const InputWrapper = styled.div`
  border: 1px solid #3a3a3a;
  background: #262626;
  display: flex;
  align-items: center;
  padding: 0 0.65rem;
  font-size: 13px;
  height: calc(2rem - 2px);
`
const BaseInput = styled.input.attrs({ type: 'number' })`
  transition: opacity 0.2s ease-in-out;
  text-align: left;
  flex: 1 1 auto;
  overflow: hidden;
  border: none;
  background: #262626;
  border-radius: 12px;
  outline: none;
  color: #d9d9d9;
  font-size: 13px;
  &:focus {
    border: none;
    background: #262626;
    outline: none;
  }
`
const InputNumber = styled(BaseInput)`
  text-align: right;
  width: 2.4rem;
`
const ExpertMode = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
export default Config
