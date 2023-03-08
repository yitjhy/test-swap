import React, { useState } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { Settings } from 'react-feather'
import Config from '@/views/swap/config'
import Modal from '@/components/modal'
import CurrencyList from '@/views/swap/currencyList'
import Header from '@/components/header'
import SubmitBtn from '@/components/submitBtn'
import SwapSection from '@/business-components/swap-section'
import ConfirmWrap from '@/views/swap/confirmSwap'
import SwapDetail from '@/views/swap/swap-detail'
import PriceDetail from '@/views/swap/price-detail'

function Swap() {
  const [isCurrencyListModalOpen, handleCurrencyListModalOpen] = useState(false)
  const [isConfirmWrapModalOpen, handleConfirmWrapModalOpen] = useState(false)
  const [isConfigModalOpen, handleConfigModalOpen] = useState(false)
  const onClickCurrency = () => {
    handleCurrencyListModalOpen(true)
  }
  const handleSubmit = () => {
    handleConfirmWrapModalOpen(true)
  }
  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <SwapWrapper>
        <Modal
          title="Confirm Swap"
          content={<ConfirmWrap />}
          open={isConfirmWrapModalOpen}
          contentStyle={{ width: 480 }}
          onClose={handleConfirmWrapModalOpen}
        />
        <Modal
          contentStyle={{ width: 480 }}
          title="Select A Token"
          content={<CurrencyList />}
          open={isCurrencyListModalOpen}
          onClose={handleCurrencyListModalOpen}
        />
        <Modal
          contentStyle={{ width: 480 }}
          title="Settings"
          content={<Config />}
          open={isConfigModalOpen}
          onClose={handleConfigModalOpen}
        />
        <Header
          title="Swap"
          operation={
            <span className="swap-header-settings-icon" onClick={() => handleConfigModalOpen(true)}>
              <Settings color="#D9D9D9" size={23} />
            </span>
          }
        />
        <div style={{ position: 'relative' }}>
          <SwapSection onClickCurrency={onClickCurrency} />
          <button className="switch-btn">
            <Image src="/arrow.png" alt="" width={21} height={28} />
          </button>
        </div>
        <SwapSection onClickCurrency={onClickCurrency} />
        <PriceDetail />
        <SubmitBtn text="WETH Insufficient Balance" onSubmit={handleSubmit} />
      </SwapWrapper>
      <SwapDetail />
    </div>
  )
}

const SwapWrapper = styled.div`
  padding: 15px;
  width: 100%;
  margin-top: 68px;
  background: #191919;
  .swap-header-settings-icon {
    width: 20px;
    height: 20px;
    color: #7780a0;
    transition: all linear 0.15s;
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }
  }
  .switch-btn {
    border: none;
    outline: none;
    width: 35px;
    height: 35px;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 100%);
    background: #262626;
    cursor: pointer;
    z-index: 2;
  }
`
export default Swap
