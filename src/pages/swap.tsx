import React, { useState } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { Settings } from 'react-feather'
import Config from '@/views/swap/config'
import Modal from '@/components/modal'
import Header from '@/components/header'
import SubmitBtn from '@/components/submitBtn'
import SwapSection, { TSwapSectionProps } from '@/business-components/swap-section'
import ConfirmWrap from '@/views/swap/confirmSwap'
import SwapDetail from '@/views/swap/swap-detail'
import PriceDetail from '@/views/swap/price-detail'
import { TCurrencyListItem } from '@/context/remoteCurrencyListContext'
import useERC20Approved from '@/hooks/contract/useERC20Approved'
import { formatEther } from 'ethers/lib/utils'
import {useSwap} from "@/hooks/useSwapRouter";
import {constants} from "ethers";

function Swap() {
  const [checkedFromCurrency, setCheckedFromCurrency] = useState<TCurrencyListItem>({} as TCurrencyListItem)
  const [checkedToCurrency, setCheckedToCurrency] = useState<TCurrencyListItem>({} as TCurrencyListItem)
  const [isConfirmWrapModalOpen, handleConfirmWrapModalOpen] = useState(false)
  const [isConfigModalOpen, handleConfigModalOpen] = useState(false)
  const [inputValueByFrom, setInputValueByFrom] = useState(0)
  const [inputValueByTo, setInputValueByTo] = useState(0)
  const swap = useSwap('0x30a2926428D33d5A6C0FB8892b89232a020991BE', '0xD1056161F4DbdeF58Ea976dA4D67daf04D44E230')
  // const swap = useSwap(constants.AddressZero, '0x30a2926428D33d5A6C0FB8892b89232a020991BE')
  console.log('swap', swap)

  const handleSubmit = () => {
    handleConfirmWrapModalOpen(true)
  }
  const onSelectedCurrencyByFrom: TSwapSectionProps['onSelectedCurrency'] = (balance, currency) => {
    setCheckedFromCurrency(currency)
  }
  const onSelectedCurrencyByTo: TSwapSectionProps['onSelectedCurrency'] = (balance, currency) => {
    setCheckedToCurrency(currency)
  }
  const handleSwitch = () => {
    setCheckedFromCurrency(checkedToCurrency)
    setCheckedToCurrency(checkedFromCurrency)
    setInputValueByFrom(inputValueByTo)
    setInputValueByTo(inputValueByFrom)
  }
  const onInputByFrom: TSwapSectionProps['onInput'] = (value) => {
    setInputValueByFrom(value)
  }
  const onInputByTo: TSwapSectionProps['onInput'] = (value) => {
    setInputValueByTo(value)
  }
  const handleMaxByFrom: TSwapSectionProps['onMax'] = (value) => {
    setInputValueByFrom(value)
  }
  const handleMaxByTo: TSwapSectionProps['onMax'] = (value) => {
    setInputValueByTo(value)
  }
  const getSubmitBtnText = () => {
    if (!checkedFromCurrency.address || !checkedToCurrency.address) {
      return 'Select Token'
    }
    if (inputValueByFrom === 0 || inputValueByTo === 0) {
      return 'Enter the number of Token'
    }
    if (checkedToCurrency.address && inputValueByTo > Number(formatEther(checkedToCurrency.balance))) {
      return 'Insufficient balance'
    }
    if (checkedFromCurrency.address && inputValueByFrom > Number(formatEther(checkedFromCurrency.balance))) {
      return 'Insufficient balance'
    }
    return 'Supply'
  }
  const getSubmitBtnStatus = () => {
    if (
      checkedFromCurrency.address &&
      checkedToCurrency.address &&
      inputValueByTo > 0 &&
      inputValueByFrom > 0 &&
      inputValueByTo <= Number(formatEther(checkedToCurrency.balance)) &&
      inputValueByFrom <= Number(formatEther(checkedFromCurrency.balance))
    ) {
      return false
    }
    return true
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
          <SwapSection
            amount={inputValueByFrom}
            onMax={handleMaxByFrom}
            checkedCurrency={checkedFromCurrency}
            onSelectedCurrency={onSelectedCurrencyByFrom}
            onInput={onInputByFrom}
          />
          <button className="switch-btn" onClick={handleSwitch}>
            <Image src="/arrow.png" alt="" width={21} height={28} />
          </button>
        </div>
        <SwapSection
          amount={inputValueByTo}
          onMax={handleMaxByTo}
          checkedCurrency={checkedToCurrency}
          onSelectedCurrency={onSelectedCurrencyByTo}
          onInput={onInputByTo}
        />
        <PriceDetail />
        <SubmitBtn text={getSubmitBtnText()} onSubmit={handleSubmit} disabled={getSubmitBtnStatus()} />
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
