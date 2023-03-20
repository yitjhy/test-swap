import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { Settings } from 'react-feather'
import Config, { TConfig } from '@/views/swap/config'
import Modal from '@/components/modal'
import Header from '@/components/header'
import SubmitBtn from '@/components/submitBtn'
import SwapSection, { TSwapSectionProps } from '@/business-components/swap-section'
import ConfirmWrap from '@/views/swap/confirmSwap'
import PriceDetail from '@/views/swap/price-detail'
import { TCurrencyListItem } from '@/context/remoteCurrencyListContext'
import { formatUnits } from 'ethers/lib/utils'
import { useSwap } from '@/hooks/useSwapRouter'
import { constants } from 'ethers'
import { isSameAddress } from '@/utils/address'
import { useRouter } from 'next/router'
import { useDialog } from '@/components/dialog'

function Swap() {
  const router = useRouter()
  const [checkedFromCurrency, setCheckedFromCurrency] = useState<TCurrencyListItem>({} as TCurrencyListItem)
  const [checkedToCurrency, setCheckedToCurrency] = useState<TCurrencyListItem>({} as TCurrencyListItem)
  const [isConfirmWrapModalOpen, handleConfirmWrapModalOpen] = useState(false)
  const [isConfigModalOpen, handleConfigModalOpen] = useState(false)
  const { openDialog } = useDialog()
  const swap = useSwap(
    isSameAddress(checkedFromCurrency.address, constants.AddressZero)
      ? constants.AddressZero
      : checkedFromCurrency.address,
    checkedToCurrency.address
  )
  console.log(swap)
  const handleSubmit = () => {
    // handleConfirmWrapModalOpen(true)
    // swap()
    swap.swap().then((data) => console.log(data))
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
    // swap.updateIn(swap.outAmount)
  }
  const onInputByFrom: TSwapSectionProps['onInput'] = (value) => {
    swap.updateIn(value)
  }
  const onInputByTo: TSwapSectionProps['onInput'] = (value) => {
    swap.updateOut(value)
  }
  const handleMaxByFrom: TSwapSectionProps['onMax'] = (value) => {
    swap.updateIn(String(value))
  }
  const handleMaxByTo: TSwapSectionProps['onMax'] = (value) => {
    console.log(value)
    console.log(typeof value)
    swap.updateOut(String(value))
  }
  const getSubmitBtnText = () => {
    if (!checkedFromCurrency.address || !checkedToCurrency.address) {
      return 'Select Token'
    }
    if (swap.outAmount === '0' || swap.inAmount === '0') {
      return 'Enter the number of Token'
    }
    if (
      checkedToCurrency.address &&
      Number(swap.outAmount) > Number(formatUnits(checkedToCurrency.balance, checkedToCurrency.decimals))
    ) {
      return 'Insufficient balance'
    }
    if (
      checkedFromCurrency.address &&
      Number(swap.inAmount) > Number(formatUnits(checkedFromCurrency.balance, checkedFromCurrency.decimals))
    ) {
      return 'Insufficient balance'
    }
    return 'Supply'
  }
  const getSubmitBtnStatus = () => {
    return !(
      checkedFromCurrency.address &&
      checkedToCurrency.address &&
      Number(swap.outAmount) > 0 &&
      Number(swap.inAmount) > 0 &&
      Number(swap.outAmount) <= Number(formatUnits(checkedToCurrency.balance, checkedToCurrency.decimals)) &&
      Number(swap.inAmount) <= Number(formatUnits(checkedFromCurrency.balance, checkedFromCurrency.decimals))
    )
  }
  const onSlippageChange: TConfig['onSlippageChange'] = (value) => {
    swap.updateSlippage(value * 100)
  }
  const onDeadlineChange: TConfig['onDeadlineChange'] = (value) => {
    swap.updateDeadline(value * 60)
  }
  useEffect(() => {
    if (swap.currentSlippage > swap.slippage && openDialog) {
      openDialog({ title: 'Warning', desc: 'Had Out Of Slippage, Please ReInput Or Reset Slippage', loading: false })
    }
  }, [swap.inAmount, swap.outAmount, openDialog, swap.currentSlippage, swap.slippage])
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
          content={<Config onSlippageChange={onSlippageChange} onDeadlineChange={onDeadlineChange} />}
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
            amount={swap.inAmount}
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
          amount={swap.outAmount}
          onMax={handleMaxByTo}
          checkedCurrency={checkedToCurrency}
          onSelectedCurrency={onSelectedCurrencyByTo}
          onInput={onInputByTo}
        />
        <PriceDetail from={checkedFromCurrency.symbol} to={checkedToCurrency.symbol} rate={swap.rate} />
        <>
          {swap.pairs.length > 0 && !isSameAddress(swap.pairs[0], constants.AddressZero) && (
            <SubmitBtn text={getSubmitBtnText()} onSubmit={handleSubmit} disabled={getSubmitBtnStatus()} />
          )}
          {swap.pairs.length > 0 && isSameAddress(swap.pairs[0], constants.AddressZero) && (
            <SubmitBtn
              disabled={false}
              text="Create Pair"
              onSubmit={() => {
                router
                  .push(`/add?addressIn=${checkedFromCurrency.address}&addressOut=${checkedToCurrency.address}`)
                  .then()
              }}
            />
          )}
          {(!checkedFromCurrency.address || !checkedToCurrency.address) && (
            <SubmitBtn disabled={true} text="Select Token" onSubmit={() => {}} />
          )}
          {/*{swap.pairs.length > 0 && !isSameAddress(swap.pairs[0], constants.AddressZero) ? (*/}
          {/*  <SubmitBtn text={getSubmitBtnText()} onSubmit={handleSubmit} disabled={getSubmitBtnStatus()} />*/}
          {/*) : (*/}
          {/*  <SubmitBtn*/}
          {/*    disabled={false}*/}
          {/*    text="Create Pair"*/}
          {/*    onSubmit={() => {*/}
          {/*      router*/}
          {/*        .push(`/add?addressIn=${checkedFromCurrency.address}&addressOut=${checkedToCurrency.address}`)*/}
          {/*        .then()*/}
          {/*    }}*/}
          {/*  />*/}
          {/*)}*/}
        </>
      </SwapWrapper>
      {/*<SwapDetail />*/}
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
