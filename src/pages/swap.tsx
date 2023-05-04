import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { Settings } from 'react-feather'
import Config, { TConfig } from '@/views/add/config'
import Modal from '@/components/modal'
import Header from '@/components/header'
import SubmitBtn from '@/components/submitBtn'
import SwapSection, { TSwapSectionProps } from '@/business-components/swap-section'
import ConfirmWrap from '@/views/swap/confirmSwap'
import PriceDetail from '@/views/swap/price-detail'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { useSwap } from '@/hooks/useSwapRouter'
import { BigNumber, constants } from 'ethers'
import { isSameAddress } from '@/utils/address'
import { useRouter } from 'next/router'
import { Global } from '@/types/global'
import useERC20Approved from '@/hooks/contract/useERC20Approved'
import { contractAddress } from '@/utils/enum'
import { ConfirmBtn } from '@/components/button'
import SwapDetail from '@/views/swap/swap-detail'
import { cutOffStr } from '@/utils'
import { getContract } from '@/hooks/contract/useContract'
import { ABI } from '@/utils/abis'
import { ERC20 } from '@/utils/abis/ERC20'
import { useSigner } from '@/hooks/contract/useSigner'
import { useWeb3React } from '@web3-react/core'
import { useRemoteCurrencyList } from '@/context/remoteCurrencyListContext'
import VideoBg from '@/business-components/videoBg'
import useMobile from '@/hooks/useMobile'

enum ExactType {
  exactIn = 'exactIn',
  exactOut = 'exactOut',
}

function Swap() {
  const isMobile = useMobile()
  const router = useRouter()
  const { account, provider } = useWeb3React()
  const [checkedFromCurrency, setCheckedFromCurrency] = useState<Global.TErc20InfoWithPair>(
    {} as Global.TErc20InfoWithPair
  )
  const [inAmount, setInAmount] = useState('')
  const [outAmount, setOutAmount] = useState('')
  const [isExpertMode, setIsExpertMode] = useState(false)
  const [exactType, setExactType] = useState<ExactType>(ExactType.exactIn)
  const [checkedToCurrency, setCheckedToCurrency] = useState<Global.TErc20InfoWithPair>({} as Global.TErc20InfoWithPair)
  const [isConfirmWrapModalOpen, handleConfirmWrapModalOpen] = useState(false)
  const [isConfigModalOpen, handleConfigModalOpen] = useState(false)
  const { currencyList: currencyListByContext } = useRemoteCurrencyList()
  const signer = useSigner()
  const swap = useSwap(
    isSameAddress(checkedFromCurrency.address, constants.AddressZero)
      ? constants.AddressZero
      : checkedFromCurrency.address,
    checkedToCurrency.address
  )
  const { approved, approve } = useERC20Approved(
    checkedFromCurrency.address,
    contractAddress.router,
    swap.inAmount && swap.inAmount !== '0'
      ? parseUnits(cutOffStr(swap.inAmount, swap.tokenInInfo.decimals), swap.tokenInInfo.decimals)
      : constants.Zero
  )
  // const { routePair, routePath } = useRoutes(
  //   checkedFromCurrency.address,
  //   checkedToCurrency.address,
  //   exactType === ExactType.exactIn ? swap.inAmount : swap.outAmount,
  //   exactType
  // )
  const updateBalance = async () => {
    let fromBalance = constants.Zero
    let toBalance = constants.Zero
    if (isSameAddress(checkedFromCurrency.address, constants.AddressZero)) {
      fromBalance = (await provider?.getBalance(account as string)) as BigNumber
    } else {
      const contract = await getContract<ERC20>(checkedFromCurrency.address, ABI.ERC20, signer)
      fromBalance = (await contract?.balanceOf(account as string)) as BigNumber
    }
    setCheckedFromCurrency({
      ...checkedFromCurrency,
      balance: fromBalance,
    })

    if (isSameAddress(checkedToCurrency.address, constants.AddressZero)) {
      toBalance = (await provider?.getBalance(account as string)) as BigNumber
    } else {
      const contract = await getContract<ERC20>(checkedToCurrency.address, ABI.ERC20, signer)
      toBalance = (await contract?.balanceOf(account as string)) as BigNumber
    }
    setCheckedToCurrency({
      ...checkedToCurrency,
      balance: toBalance,
    })
  }

  const handleSubmit = () => {
    swap.swap(isExpertMode).then(() => {
      swap.refreshRoute()
      handleConfirmWrapModalOpen(false)
      updateBalance().then()
    })
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
    swap.updateIn(swap.outAmount)
  }
  const onInputByFrom: TSwapSectionProps['onInput'] = (value) => {
    swap.updateIn(value)
    setExactType(ExactType.exactIn)
  }
  const onInputByTo: TSwapSectionProps['onInput'] = (value) => {
    swap.updateOut(value)
    setExactType(ExactType.exactOut)
  }
  const handleMaxByFrom: TSwapSectionProps['onMax'] = (value) => {
    swap.updateIn(String(value))
    setExactType(ExactType.exactIn)
  }
  const handleMaxByTo: TSwapSectionProps['onMax'] = (value) => {
    swap.updateOut(String(value))
    setExactType(ExactType.exactOut)
  }
  const getSubmitBtnText = () => {
    if (!checkedFromCurrency.address || !checkedToCurrency.address) {
      return 'Select a token'
    }
    if (swap.outAmount === '0' || swap.inAmount === '0') {
      return 'Enter an amount'
    }
    if (
      checkedFromCurrency.address &&
      Number(swap.inAmount) > Number(formatUnits(checkedFromCurrency.balance, checkedFromCurrency.decimals))
    ) {
      return 'Insufficient balance'
    }
    if (swap.currentSlippage > swap.slippage && swap.currentSlippage / swap.slippage > 1.2) {
      if (isExpertMode) {
        return 'Swap Anyway'
      } else {
        return 'Price Impact Too High'
      }
    }
    if (
      swap.currentSlippage > swap.slippage &&
      swap.currentSlippage / swap.slippage > 1 &&
      swap.currentSlippage / swap.slippage < 1.2
    ) {
      return 'Swap Anyway'
    }
    return 'Swap'
  }
  const getSubmitBtnStatus = () => {
    if (
      swap.currentSlippage > swap.slippage &&
      swap.currentSlippage / swap.slippage > 1.2 &&
      Number(swap.inAmount) > 0 &&
      Number(swap.inAmount) <= Number(formatUnits(checkedFromCurrency.balance, checkedFromCurrency.decimals))
    ) {
      return !isExpertMode
    }
    return !(
      approved &&
      checkedFromCurrency.address !== checkedToCurrency.address &&
      checkedFromCurrency.address &&
      checkedToCurrency.address &&
      Number(swap.inAmount) > 0 &&
      Number(swap.inAmount) <= Number(formatUnits(checkedFromCurrency.balance, checkedFromCurrency.decimals))
    )
  }
  const onSlippageChange: TConfig['onSlippageChange'] = (value) => {
    swap.updateSlippage(value * 100)
  }
  const onDeadlineChange: TConfig['onDeadlineChange'] = (value) => {
    swap.updateDeadline(value * 60)
  }
  const onExpertModeChange: TConfig['onExpertModeChange'] = (value) => {
    setIsExpertMode(value)
  }
  useEffect(() => {
    if (currencyListByContext.length) {
      setCheckedFromCurrency(currencyListByContext[0])
    }
  }, [currencyListByContext])
  useEffect(() => {
    if (swap.inAmount && swap.inAmount !== '0') {
      setInAmount(swap.inAmount)
    } else {
      setInAmount('')
    }
    if (swap.outAmount && swap.outAmount !== '0') {
      setOutAmount(swap.outAmount)
    } else {
      setOutAmount('')
    }
  }, [swap.inAmount, swap.outAmount])
  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <Modal
        title="Confirm Swap"
        content={
          <ConfirmWrap
            isConfirmWrapModalOpen={isConfirmWrapModalOpen}
            onSubmit={handleSubmit}
            outAmount={swap.outAmount}
            inAmount={swap.inAmount}
            rate={swap.rate}
            inSymbol={checkedFromCurrency.symbol}
            outSymbol={checkedToCurrency.symbol}
            currentSlippage={swap.currentSlippage}
            lock={swap.lock}
            slippage={swap.slippage}
            outDecimals={swap.tokenOutInfo.decimals}
            minOut={swap.minOut}
            inDecimals={swap.tokenInInfo.decimals}
            maxIn={swap.maxIn}
          />
        }
        open={isConfirmWrapModalOpen}
        contentStyle={{ width: 480 }}
        onClose={handleConfirmWrapModalOpen}
      />
      <Modal
        contentStyle={{ width: 480 }}
        title="Settings"
        content={
          <Config
            storageKey="swapConfig"
            onSlippageChange={onSlippageChange}
            onDeadlineChange={onDeadlineChange}
            onExpertModeChange={onExpertModeChange}
          />
        }
        open={isConfigModalOpen}
        onClose={handleConfigModalOpen}
      />
      {!isMobile && <VideoBg src="https://d26w3tglonh3r.cloudfront.net/video/swap.mp4" />}
      <div style={{ position: 'relative', zIndex: 5 }}>
        <SwapWrapper>
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
              amount={inAmount}
              onMax={handleMaxByFrom}
              checkedCurrency={checkedFromCurrency}
              onSelectedCurrency={onSelectedCurrencyByFrom}
              onInput={onInputByFrom}
            />
            <button className="switch-btn" onClick={handleSwitch}>
              <Image src="/arrow.svg" alt="" width={21} height={28} />
            </button>
          </div>
          <SwapSection
            amount={outAmount}
            onMax={handleMaxByTo}
            checkedCurrency={checkedToCurrency}
            onSelectedCurrency={onSelectedCurrencyByTo}
            onInput={onInputByTo}
            hiddenMax={true}
          />
          {checkedFromCurrency.address &&
            checkedToCurrency.address &&
            swap.inAmount &&
            swap.inAmount !== '0' &&
            swap.outAmount &&
            swap.outAmount !== '0' && (
              <PriceDetail
                from={checkedFromCurrency.symbol}
                inDecimals={checkedFromCurrency.decimals}
                to={checkedToCurrency.symbol}
                outDecimals={checkedToCurrency.decimals}
                rate={swap.rate}
              />
            )}
          <>
            {!approved &&
              checkedFromCurrency.address &&
              parseUnits(cutOffStr(inAmount || '0', checkedFromCurrency.decimals), checkedFromCurrency.decimals).lte(
                checkedFromCurrency.balance
              ) && <ApproveBtn onClick={approve}>Approve {checkedFromCurrency.symbol}</ApproveBtn>}
            {swap.routes.length > 0 && (
              <SubmitBtn
                text={getSubmitBtnText()}
                onSubmit={() => {
                  handleConfirmWrapModalOpen(true)
                  // handleSubmit()
                }}
                disabled={getSubmitBtnStatus()}
              />
            )}
            {swap.routes.length === 0 && checkedFromCurrency.address !== checkedToCurrency.address && (
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
              <SubmitBtn disabled={true} text="Select a token" onSubmit={() => {}} />
            )}
          </>
        </SwapWrapper>
        {checkedFromCurrency.address &&
          checkedToCurrency.address &&
          swap.inAmount &&
          swap.inAmount !== '0' &&
          swap.outAmount &&
          swap.outAmount !== '0' && (
            <SwapDetail
              currentSlippage={swap.currentSlippage}
              lock={swap.lock}
              maxIn={swap.maxIn}
              minOut={swap.minOut}
              outAmount={swap.outAmount}
              inSymbol={checkedFromCurrency.symbol}
              inDecimals={swap.tokenInInfo.decimals}
              outSymbol={checkedToCurrency.symbol}
              outDecimals={swap.tokenOutInfo.decimals}
              slippage={swap.slippage}
            />
          )}
      </div>
    </div>
  )
}
const ApproveBtn = styled(ConfirmBtn)`
  flex: 1;
  padding: 0 0.8rem;
  margin-top: 0.9rem;
  user-select: none;
  width: 100%;
`
const SwapWrapper = styled.div`
  padding: 15px;
  width: 100%;
  margin-top: 168px;
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
