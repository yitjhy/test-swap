import React, { useState, FC, ChangeEvent, useEffect } from 'react'
import styled from 'styled-components'
import { useDebounceFn } from 'ahooks'
import { ChevronDown } from 'react-feather'
import { formatUnits } from 'ethers/lib/utils'
import Modal from '@/components/modal'
import CurrencyList, { TSelectCurrencyProps } from '@/business-components/currencyList'
import { judgeImgUrl } from '@/utils'
import { Global } from '@/types/global'

export enum TInputCurrency {
  simple = 'simple',
  normal = 'normal',
}
export type TSwapSectionProps = {
  checkedCurrency: Global.TErc20InfoWithPair
  amount?: string
  onInput?: (value: string) => void
  onMax?: (value: string | undefined) => void
  onSelectedCurrency?: (balance: number, currency: Global.TErc20InfoWithPair) => void
  type?: TInputCurrency
  readonly?: boolean
  style?: React.CSSProperties
  hiddenMax?: boolean
}

const SwapSection: FC<TSwapSectionProps> = ({
  amount,
  type,
  readonly,
  style,
  onSelectedCurrency,
  onMax,
  onInput,
  checkedCurrency,
  hiddenMax,
}) => {
  const [inputAmount, setInputAmount] = useState<string | undefined>()
  const [isCurrencyListModalOpen, handleCurrencyListModalOpen] = useState(false)
  const [currencyData, setCurrencyData] = useState<Global.TErc20InfoWithPair>(checkedCurrency || {})
  const goSelectCurrency = () => {
    handleCurrencyListModalOpen(true)
  }
  const handleSelectedCurrency: TSelectCurrencyProps['onChecked'] = (data) => {
    handleCurrencyListModalOpen(false)
    setCurrencyData(data)
    const balance = currencyData?.balance ? Number(formatUnits(currencyData.balance, currencyData.decimals)) : 0
    onSelectedCurrency?.(balance, data)
  }
  const handleMax = () => {
    const balance = currencyData?.balance ? formatUnits(currencyData.balance, currencyData.decimals) : undefined
    setInputAmount(balance)
    onMax?.(balance)
  }
  const { run: onInputDebounce } = useDebounceFn(
    (value: string) => {
      onInput?.(value)
    },
    { wait: 500 }
  )
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.replace(/[^\d]/g, '') !== inputAmount) {
      setInputAmount(e.target.value ? e.target.value.replace(/[^\d]/g, '') : undefined)
      onInputDebounce(e.target.value.replace(/[^\d]/g, ''))
    }
  }
  useEffect(() => {
    setCurrencyData(checkedCurrency)
  }, [checkedCurrency])
  useEffect(() => {
    setInputAmount(amount ? amount : undefined)
  }, [amount])
  return (
    <SwapSectionWrapper style={style}>
      <Modal
        contentStyle={{ width: 480 }}
        title="Select a token"
        content={<CurrencyList onChecked={handleSelectedCurrency} checkedCurrency={checkedCurrency} />}
        open={isCurrencyListModalOpen}
        onClose={handleCurrencyListModalOpen}
      />
      <div className="swap-currency-input-row">
        <input
          className="numerical-input"
          placeholder="0"
          disabled={readonly}
          value={inputAmount}
          onChange={handleInput}
        />
        <button
          style={{ cursor: readonly ? 'default' : 'pointer' }}
          className="currency-button"
          onClick={() => {
            if (!readonly) {
              goSelectCurrency()
            }
          }}
        >
          {currencyData && Object.keys(currencyData).length > 0 ? (
            <>
              {judgeImgUrl('') ? (
                <img className="currency-icon" src={''} alt="" width={30} height={30} />
              ) : (
                <div className="logo-wrapper">{currencyData.symbol?.slice(0, 3)}</div>
              )}
              <div className="currency-symbol">{currencyData.symbol}</div>
            </>
          ) : (
            <span style={{ height: 30, display: 'flex', alignItems: 'center', paddingLeft: 3 }}>Select Token</span>
          )}

          <div className="arrow">
            <ChevronDown size={16} />
          </div>
        </button>
      </div>
      {(type === TInputCurrency.normal || !type) && (
        <div className="swap-currency-fiat-row">
          <div className="currency-balance">
            Balance: {currencyData?.balance ? formatUnits(currencyData.balance, currencyData.decimals) : '0'}{' '}
            {currencyData?.balance && !readonly && !hiddenMax && (
              <button className="comparative-btn" onClick={handleMax}>
                Max
              </button>
            )}
          </div>
        </div>
      )}
    </SwapSectionWrapper>
  )
}
const SwapSectionWrapper = styled.div`
  margin-top: 20px;
  background-color: #262626;
  padding: 20px 16px 16px;
  color: #aaaaaa;
  font-size: 14px;
  font-weight: 500;
  .swap-currency-input-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .numerical-input {
      transition: opacity 0.2s ease-in-out;
      text-align: left;
      font-size: 26px;
      line-height: 44px;
      flex: 1;
      overflow: hidden;
      border: none;
      background: none;
      color: #fefefe;
      &:focus {
        border: none;
        background: none;
        outline: none;
      }
    }
    .currency-button {
      align-items: center;
      background-color: #383838;
      padding: 4px 8px 4px 4px;
      gap: 8px;
      margin-left: 12px;
      cursor: pointer;
      border: none;
      user-select: none;
      border-radius: 16px 0 0 16px;
      outline: none;
      display: flex;
      font-size: 20px;
      font-weight: bolder;
      color: #d9d9d9;
      .currency-icon {
        width: 30px;
        height: 30px;
      }
      .logo-wrapper {
        width: 30px;
        height: 30px;
        border-radius: 40px;
        background: #262626;
        font-size: 11px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-transform: uppercase;
      }
      .currency-symbol {
        font-size: 20px;
      }
      .arrow {
        display: flex;
        font-size: 16px;
      }
    }
  }
  .swap-currency-fiat-row {
    display: flex;
    min-height: 20px;
    padding: 10px 0 0 0;
    justify-content: flex-end;
    font-weight: 400;
    font-size: 14px;
    .animate {
      width: 4rem;
      height: 1rem;
      border-radius: 4px;
      animation-fill-mode: both;
      animation: wave 1.5s infinite;
      background: linear-gradient(to left, #e8ecfb 25%, #d2d9ee 50%, #e8ecfb 75%);
      will-change: background-position;
      background-size: 400%;
      @keyframes wave {
        0% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0 50%;
        }
      }
    }
    .currency-balance {
      display: flex;
      .comparative-btn {
        outline: none;
        background-color: transparent;
        border: none;
        color: #fb118e;
        cursor: pointer;
        /* padding: 4px 6px; */
        user-select: none;
        margin-left: 0.5rem;
      }
    }
  }
`
export default SwapSection
