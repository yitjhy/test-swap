import styled from 'styled-components'
import Popover from '@/components/popover'
import { HelpCircle } from 'react-feather'
import Switch from '@/components/switch'
import Modal from '@/components/modal'
import { useState, FC, ChangeEvent, useEffect, useRef } from 'react'
import ExpertModeCom from './expertMode'
import { useWeb3React } from '@web3-react/core'

export type TConfig = {
  storageKey: string
  onSlippageChange: (value: number) => void
  onDeadlineChange: (value: number) => void
  onExpertModeChange: (value: boolean) => void
}

const setStorage = (account: string, storageKey: string, key: string, value: any) => {
  const addConfig = localStorage.getItem(storageKey)
  if (addConfig) {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        ...JSON.parse(addConfig),
        [account]: {
          ...JSON.parse(addConfig)[account],
          [key]: value,
        },
      })
    )
  } else {
    localStorage.setItem(storageKey, JSON.stringify({ [account]: { [key]: value } }))
  }
}

const getStorage = (account: string, storageKey: string, key: string) => {
  const addConfigFromStorage = localStorage.getItem(storageKey)
  if (addConfigFromStorage) {
    const addConfig = JSON.parse(addConfigFromStorage)
    return addConfig[account] ? addConfig[account][key] : undefined
  }
}

const Config: FC<TConfig> = ({ onSlippageChange, onDeadlineChange, onExpertModeChange, storageKey }) => {
  const switchRef = useRef()
  const { account } = useWeb3React()
  const [isExpertModeModalOpen, handleExpertModeModalOpen] = useState(false)
  const [slippage, setSlippage] = useState<number>(5)
  const [deadline, setDeadline] = useState<number>(30)
  const [isExpertMode, setIsExpertMode] = useState(false)
  const handleSlippageChange = (value: number) => {
    setSlippage(value)
    setStorage(account as string, storageKey, 'slippage', value)
    onSlippageChange(value)
  }
  const handleDeadline = (e: ChangeEvent<HTMLInputElement>) => {
    setDeadline(Number(e.target.value))
    onDeadlineChange(Number(e.target.value))
    setStorage(account as string, storageKey, 'deadline', e.target.value)
  }
  const onTurnOnExpertMode = () => {
    setIsExpertMode(true)
    setStorage(account as string, storageKey, 'isExpertMode', true)
    handleExpertModeModalOpen(false)
    onExpertModeChange(true)
  }
  const onExpertModeModalClose = () => {
    handleExpertModeModalOpen(false)
    const isExpertMode = getStorage(account as string, storageKey, 'isExpertMode')
    // @ts-ignore
    switchRef?.current?.handleChecked?.(!!isExpertMode)
  }
  useEffect(() => {
    if (account && storageKey) {
      const isExpertMode = getStorage(account, storageKey, 'isExpertMode')
      setIsExpertMode(!!isExpertMode)
      onExpertModeChange(!!isExpertMode)
      setStorage(account, storageKey, 'isExpertMode', !!isExpertMode)
      const slippageFromStorage = getStorage(account, storageKey, 'slippage')
      if (slippageFromStorage && slippageFromStorage !== 0) {
        handleSlippageChange(Number(slippageFromStorage))
      } else {
        handleSlippageChange(slippage)
      }
      const deadlineFromStorage = getStorage(account, storageKey, 'deadline')
      if (deadlineFromStorage && slippageFromStorage !== 0) {
        setDeadline(Number(deadlineFromStorage))
        onDeadlineChange(Number(deadlineFromStorage))
      } else {
        onDeadlineChange(deadline)
        setStorage(account, storageKey, 'deadline', deadline)
      }
    }
  }, [account, storageKey])
  return (
    <ConfigWrapper>
      <Modal
        contentStyle={{ width: 480 }}
        title="Expert Mode"
        content={<ExpertModeCom onTurnOnExpertMode={onTurnOnExpertMode} />}
        open={isExpertModeModalOpen}
        onClose={onExpertModeModalClose}
      />
      <div className="split-line" />
      <ConfigItemWrapper>
        <ConfigLabelWrapper>
          <span className="label-text">Slippage Tolerance</span>
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
        <ConfigValueWrapper>
          {[0.1, 0.5, 1.0].map((item, index) => {
            return (
              <SlippageToleranceBtn
                checked={slippage === item}
                key={index}
                onClick={() => {
                  handleSlippageChange(item)
                }}
              >
                {item}%
              </SlippageToleranceBtn>
            )
          })}
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <InputWrapper>
              <InputNumber
                placeholder="0.50"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  handleSlippageChange(Number(e.target.value))
                }}
                value={slippage}
              />
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
                content={
                  <span className="tip-text">
                    Your transaction will revert if it is pending for more than this period of time.
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
          <ConfigValueWrapper style={{ justifyContent: 'start' }}>
            <InputWrapper>
              <InputNumber placeholder="30" value={deadline} onChange={handleDeadline} />
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
                    Allow high price impact trades and skip the confirm screen. Use at your own risk.
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
              ref={switchRef}
              checked={isExpertMode}
              onChange={(isExpertMode) => {
                if (isExpertMode) handleExpertModeModalOpen(true)
                if (!isExpertMode) {
                  onExpertModeChange(false)
                  setIsExpertMode(false)
                  setStorage(account as string, storageKey, 'isExpertMode', false)
                }
              }}
            />
          </div>
        </ExpertMode>
      </ConfigItemWrapper>
    </ConfigWrapper>
  )
}
const SlippageToleranceBtn = styled.button<{ checked: boolean }>`
  border: none;
  outline: none;
  height: 2rem;
  width: 5.44rem;
  background: ${({ checked }) => (checked ? '#bfff37' : '#262626')};
  color: ${({ checked }) => (checked ? '#120D00' : '#d9d9d9')};
  font-size: 13px;
  cursor: pointer;
  transition: all linear 0.12s;
`
const ConfigWrapper = styled.div`
  display: grid;
  grid-auto-rows: auto;
  row-gap: 25px;
  color: #d9d9d9;
  font-size: 14px;
  padding-bottom: 0.8rem;
  .split-line {
    border-top: 1px solid #262626;
  }
  .config-title {
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
