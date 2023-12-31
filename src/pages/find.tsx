import React, { useState } from 'react'
import styled from 'styled-components'
import { CaretDownOutlined, PlusCircleOutlined, LeftOutlined } from '@ant-design/icons'
import CurrencyList, { TSelectCurrencyProps } from '@/business-components/currencyList'
import Modal from '@/components/modal'
import usePairAddress from '@/hooks/usePairAddress'
import { invalidAddress } from '@/utils/enum'
import { useRouter } from 'next/router'
import { getAddress, addPairAddressToStorage } from '@/utils'
import { Global } from '@/types/global'
import { useWeb3React } from '@web3-react/core'
import VideoBg from '@/business-components/videoBg'
import useMobile from '@/hooks/useMobile'

function Find() {
  const isMobile = useMobile()
  const router = useRouter()
  const { account } = useWeb3React()
  const [isFromCurrencyListModalOpen, handleFromCurrencyListModalOpen] = useState(false)
  const [isToCurrencyListModalOpen, handleToCurrencyListModalOpen] = useState(false)
  const [fromCurrency, setFromCurrency] = useState<Global.TErc20InfoWithPair>({} as Global.TErc20InfoWithPair)
  const [toCurrency, setToCurrency] = useState<Global.TErc20InfoWithPair>({} as Global.TErc20InfoWithPair)
  const { pairAddress } = usePairAddress(
    getAddress(fromCurrency.address, toCurrency.address).fromAddress,
    getAddress(fromCurrency.address, toCurrency.address).toAddress
  )
  const handleSelectedFromCurrency: TSelectCurrencyProps['onChecked'] = (data) => {
    handleFromCurrencyListModalOpen(false)
    setFromCurrency(data)
  }
  const handleSelectedToCurrency: TSelectCurrencyProps['onChecked'] = (data) => {
    handleToCurrencyListModalOpen(false)
    setToCurrency(data)
  }
  const submit = () => {
    addPairAddressToStorage(account as string, pairAddress)
    router.push('/lp').then()
  }
  return (
    <LPWrapper>
      <Modal
        contentStyle={{ width: 480 }}
        title="Select Token"
        content={<CurrencyList onChecked={handleSelectedFromCurrency} checkedCurrency={fromCurrency} />}
        open={isFromCurrencyListModalOpen}
        onClose={handleFromCurrencyListModalOpen}
      />
      <Modal
        contentStyle={{ width: 480 }}
        title="Select Token"
        content={<CurrencyList onChecked={handleSelectedToCurrency} checkedCurrency={toCurrency} />}
        open={isToCurrencyListModalOpen}
        onClose={handleToCurrencyListModalOpen}
      />
      {!isMobile && <VideoBg src="https://d26w3tglonh3r.cloudfront.net/video/liquidity.mp4" />}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          background: '#1A1A1A',
          padding: '21px 19px',
          rowGap: '14px',
          display: 'grid',
        }}
      >
        <div className="collapse-header">
          <span className="back-icon" onClick={() => router.back()}>
            <LeftOutlined />
          </span>
          <div className="title">Import Pool</div>
        </div>
        <div
          className="select-currency-wrapper"
          onClick={() => {
            handleFromCurrencyListModalOpen(true)
          }}
        >
          <span className="currency-symbol">{fromCurrency.symbol}</span>
          <span className="arrow">
            <CaretDownOutlined />
          </span>
        </div>
        <div className="icon-wrapper">
          <PlusCircleOutlined />
        </div>
        <div
          className="select-currency-wrapper"
          onClick={() => {
            handleToCurrencyListModalOpen(true)
          }}
        >
          <span className="currency-symbol">{toCurrency.symbol}</span>
          <span className="arrow">
            <CaretDownOutlined />
          </span>
        </div>
        <div className="tip-wrapper">
          <div>Select a token to find your liquidity.</div>
          <div>
            <button
              className={`submit ${
                !(fromCurrency.address && toCurrency.address && pairAddress && pairAddress !== invalidAddress)
                  ? 'invalid'
                  : ''
              }`}
              disabled={!(fromCurrency.address && toCurrency.address && pairAddress && pairAddress !== invalidAddress)}
              onClick={submit}
            >
              {fromCurrency.address && toCurrency.address && pairAddress && pairAddress !== invalidAddress
                ? 'Manage This Pool'
                : 'Invalid Pair'}
            </button>
          </div>
        </div>
      </div>
    </LPWrapper>
  )
}
const LPWrapper = styled.div`
  max-width: 480px;
  margin: 168px auto 0;
  background: #1a1a1a;
  padding: 21px 19px;
  row-gap: 14px;
  display: grid;
  .collapse-header {
    display: flex;
    column-gap: 1rem;
    align-items: center;
    //justify-content: center;
    font-size: 20px;
    margin-bottom: 40px;
    position: relative;
    .back-icon {
      cursor: pointer;
      z-index: 1;
    }
    .title {
      width: 100%;
      position: absolute;
      text-align: center;
      z-index: 0;
    }
  }
  .select-currency-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #383838;
    padding: 12px 11px;
    row-gap: 14px;
    cursor: pointer;
    .currency-symbol {
      color: #d9d9d9;
    }
    .arrow {
    }
  }
  .icon-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .tip-wrapper {
    border: 1px solid #383838;
    padding: 68px 0;
    font-size: 14px;
    color: #d9d9d9;
    display: grid;
    row-gap: 12px;
    div {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .submit {
      background: #bfff37;
      padding: 11px 27px;
      font-size: 16px;
      color: #120d00;
      cursor: pointer;
      border: none;
      outline: none;
      display: flex;
      justify-content: center;
      align-items: center;
      &.invalid {
        background: #383838;
        cursor: not-allowed;
        pointer-events: auto;
        color: #d9d9d9;
        opacity: 0.8;
      }
    }
  }
`
export default Find
