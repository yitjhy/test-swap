import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { constants } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'
import styled from 'styled-components'
import { ChevronLeft, Plus, Settings } from 'react-feather'
import SwapSection, { TSwapSectionProps } from '@/business-components/swap-section'
import SubmitBtn from '@/components/submitBtn'
import Rate from '@/views/add/rate'
import Tip from '@/views/add/tip'
import LPDetail from '@/views/add/lp-detail'
import { ConfirmBtn } from '@/components/button'
import Modal from '@/components/modal'
import Config, { TConfig } from '@/views/swap/config'
import useERC20Approved from '@/hooks/contract/useERC20Approved'
import { TCurrencyListItem } from '@/context/remoteCurrencyListContext'
import useCreatePair from '@/hooks/useCreatePair'
import usePairAddress from '@/hooks/usePairAddress'
import { contractAddress, invalidAddress, platFormAddress } from '@/utils/enum'
import usePairInfo from '@/hooks/usePairInfo'
import useLiquidityRate from '@/hooks/useLiquidityRate'
import { getAddress } from '@/utils'
import useValueByInput from '@/hooks/useOutValueByInputIn'
import useErc20InfoList from '@/hooks/useErc20InfoList'
import { isSameAddress } from '@/utils/address'
import { Global } from '@/types/global'

const IncreaseLP = () => {
  const router = useRouter()
  const { query } = useRouter()
  const [isConfigModalOpen, handleConfigModalOpen] = useState(false)
  const [checkedFromCurrency, setCheckedFromCurrency] = useState<Global.TErc20InfoWithPair>(
    {} as Global.TErc20InfoWithPair
  )
  const [checkedToCurrency, setCheckedToCurrency] = useState<Global.TErc20InfoWithPair>({} as Global.TErc20InfoWithPair)
  const [inputValueByTo, setInputValueByTo] = useState<string | undefined>()
  const [inputValueByFrom, setInputValueByFrom] = useState<string | undefined>()
  const [pairAddress, setPairAddress] = useState(constants.AddressZero)
  const { pairDetail, updatePairDetail } = usePairInfo(pairAddress)
  const { addLiquidity, addLiquidityETH } = useCreatePair()
  const { getOutValueByInputIn, getInValueByInputOut } = useValueByInput(
    getAddress(checkedFromCurrency.address, checkedToCurrency.address).fromAddress,
    getAddress(checkedFromCurrency.address, checkedToCurrency.address).toAddress
  )
  const { pairAddress: pairAddressFromHook } = usePairAddress(
    getAddress(checkedFromCurrency.address, checkedToCurrency.address).fromAddress,
    getAddress(checkedFromCurrency.address, checkedToCurrency.address).toAddress
  )
  const { approved: isApprovedCurrencyFrom, approve: approveCurrencyFrom } = useERC20Approved(
    checkedFromCurrency.address,
    contractAddress.router
  )
  const { approved: isApprovedCurrencyTo, approve: approveCurrencyTo } = useERC20Approved(
    checkedToCurrency.address,
    contractAddress.router
  )
  const { shareOfPool } = useLiquidityRate(
    { address: checkedFromCurrency.address, inputValue: inputValueByFrom },
    { address: checkedToCurrency.address, inputValue: inputValueByTo }
  )
  const onSelectedCurrencyByFrom: TSwapSectionProps['onSelectedCurrency'] = (balance, currency) => {
    setCheckedFromCurrency(currency)
  }
  const onSelectedCurrencyByTo: TSwapSectionProps['onSelectedCurrency'] = (balance, currency) => {
    setCheckedToCurrency(currency)
  }
  const onInputByFrom: TSwapSectionProps['onInput'] = async (value) => {
    setInputValueByFrom(value)
    if (!isSameAddress(pairAddress, constants.AddressZero)) {
      const res = await getOutValueByInputIn(value)
      setInputValueByTo(res?.value)
    }
  }
  const onInputByTo: TSwapSectionProps['onInput'] = async (value) => {
    setInputValueByTo(value)
    if (!isSameAddress(pairAddress, constants.AddressZero)) {
      const res = await getInValueByInputOut(value)
      setInputValueByFrom(res?.value)
    }
  }
  const handleMaxByFrom: TSwapSectionProps['onMax'] = async (value) => {
    setInputValueByFrom(value)
    if (!isSameAddress(pairAddress, constants.AddressZero)) {
      const res = await getOutValueByInputIn(value)
      setInputValueByTo(res?.value)
    }
  }
  const handleMaxByTo: TSwapSectionProps['onMax'] = async (value) => {
    setInputValueByTo(value)
    if (!isSameAddress(pairAddress, constants.AddressZero)) {
      const res = await getInValueByInputOut(value)
      setInputValueByFrom(res?.value)
    }
  }
  const addCallback = async () => {
    updatePairDetail()
  }
  const handleSubmit = async () => {
    if (checkedFromCurrency.address === platFormAddress) {
      await addLiquidityETH(checkedToCurrency.address, parseUnits(String(inputValueByTo), checkedToCurrency.decimals), {
        value: parseUnits(String(inputValueByFrom), checkedFromCurrency.decimals),
      })
      addCallback().then()
    }
    if (checkedToCurrency.address === platFormAddress) {
      await addLiquidityETH(
        checkedFromCurrency.address,
        parseUnits(String(inputValueByFrom), checkedFromCurrency.decimals),
        {
          value: parseUnits(String(checkedToCurrency), checkedToCurrency.decimals),
        }
      )
      addCallback().then()
    }
    if (checkedToCurrency.address !== platFormAddress && checkedFromCurrency.address !== platFormAddress) {
      await addLiquidity(
        checkedFromCurrency.address,
        checkedToCurrency.address,
        parseUnits(String(inputValueByFrom), checkedFromCurrency.decimals),
        parseUnits(String(inputValueByTo), checkedToCurrency.decimals)
      )
      addCallback().then()
    }
  }
  const getSubmitBtnText = () => {
    if (!checkedFromCurrency.address || !checkedToCurrency.address) {
      return 'Select Token'
    }
    if (Number(inputValueByFrom) === 0 || Number(inputValueByTo) === 0) {
      return 'Enter the number of Token'
    }
    if (
      checkedToCurrency.address &&
      Number(inputValueByTo) > Number(formatUnits(checkedToCurrency.balance, checkedToCurrency.decimals))
    ) {
      return 'Insufficient balance'
    }
    if (
      checkedFromCurrency.address &&
      Number(inputValueByFrom) > Number(formatUnits(checkedFromCurrency.balance, checkedFromCurrency.decimals))
    ) {
      return 'Insufficient balance'
    }
    return 'Supply'
  }
  const getSubmitBtnStatus = () => {
    return !(
      checkedFromCurrency.address &&
      checkedToCurrency.address &&
      Number(inputValueByTo) > 0 &&
      Number(inputValueByFrom) > 0 &&
      Number(inputValueByTo) <= Number(formatUnits(checkedToCurrency.balance, checkedToCurrency.decimals)) &&
      Number(inputValueByFrom) <= Number(formatUnits(checkedFromCurrency.balance, checkedFromCurrency.decimals))
    )
  }
  const [addressListOfQuery, setAddressListOfQuery] = useState<string[]>([])
  const currencyListFromQuery = useErc20InfoList(addressListOfQuery)
  useEffect(() => {
    setPairAddress(pairAddressFromHook)
  }, [pairAddressFromHook])
  useEffect(() => {
    if (query.address) setPairAddress(query.address as string)
  }, [query.address])
  useEffect(() => {
    if (query.addressIn && query.addressOut) {
      setAddressListOfQuery([query.addressIn as string, query.addressOut as string])
    }
  }, [query])
  useEffect(() => {
    if (currencyListFromQuery.length) {
      setCheckedFromCurrency(currencyListFromQuery[0] as TCurrencyListItem)
      setCheckedToCurrency(currencyListFromQuery[1] as TCurrencyListItem)
    }
  }, [currencyListFromQuery])
  useEffect(() => {
    if (pairDetail.tokens && pairDetail.tokens.length) {
      if (pairDetail.tokens[0].address === checkedFromCurrency.address) {
        setCheckedFromCurrency(pairDetail.tokens[0] as TCurrencyListItem)
        setCheckedToCurrency(pairDetail.tokens[1] as TCurrencyListItem)
      } else {
        setCheckedFromCurrency(pairDetail.tokens[1] as TCurrencyListItem)
        setCheckedToCurrency(pairDetail.tokens[0] as TCurrencyListItem)
      }
    }
  }, [pairDetail])
  const onSlippageChange: TConfig['onSlippageChange'] = (value) => {
    console.log(value)
  }
  const onDeadlineChange: TConfig['onDeadlineChange'] = (value) => {
    console.log(value)
  }
  return (
    <IncreaseLPWrapper>
      <Modal
        contentStyle={{ width: 480 }}
        title="Settings"
        content={<Config onDeadlineChange={onDeadlineChange} onSlippageChange={onSlippageChange} />}
        open={isConfigModalOpen}
        onClose={handleConfigModalOpen}
      />
      <div style={{ background: '#1a1a1a', padding: '1rem' }}>
        <div className="header">
          <span
            className="back-btn"
            onClick={() => {
              router.back()
            }}
          >
            <ChevronLeft size={30} />
          </span>
          <span>Increase Liquidity</span>
          <Settings
            color="#D9D9D9"
            size={23}
            cursor="pointer"
            onClick={() => {
              handleConfigModalOpen(true)
            }}
          />
        </div>
        <Tip />
        <SwapSection
          amount={inputValueByFrom}
          onMax={handleMaxByFrom}
          checkedCurrency={checkedFromCurrency}
          onSelectedCurrency={onSelectedCurrencyByFrom}
          onInput={onInputByFrom}
        />
        <div className="add-icon">
          <Plus color="#191919" size={18} />
        </div>
        <SwapSection
          amount={inputValueByTo}
          onMax={handleMaxByTo}
          checkedCurrency={checkedToCurrency}
          onSelectedCurrency={onSelectedCurrencyByTo}
          onInput={onInputByTo}
        />
        {pairDetail.pairAddress &&
        pairDetail.pairAddress !== invalidAddress &&
        pairDetail.rate &&
        pairDetail.rate.length > 0 &&
        checkedFromCurrency.address &&
        checkedToCurrency.address ? (
          <Rate shareOfPool={shareOfPool} rate={pairDetail.rate} />
        ) : null}
        <div className="approve-wrapper">
          {!isApprovedCurrencyFrom && checkedFromCurrency.address && (
            <ApproveBtn onClick={approveCurrencyFrom}>Approve {checkedFromCurrency.symbol}</ApproveBtn>
          )}
          {!isApprovedCurrencyTo && checkedToCurrency.address && (
            <ApproveBtn onClick={approveCurrencyTo}>Approve {checkedToCurrency.symbol}</ApproveBtn>
          )}
        </div>
        <SubmitBtn text={getSubmitBtnText()} onSubmit={handleSubmit} disabled={getSubmitBtnStatus()} />
      </div>
      <div style={{ padding: '0 0.7rem' }}>
        {pairDetail.tokens && pairDetail.tokens.length > 0 && <LPDetail data={pairDetail} />}
      </div>
    </IncreaseLPWrapper>
  )
}

const IncreaseLPWrapper = styled.div`
  color: #d9d9d9;
  padding: 1rem;
  max-width: 480px;
  margin: 68px auto 0;
  row-gap: 1.25rem;
  .approve-wrapper {
    display: flex;
    justify-content: space-between;
    margin-top: 1.8rem;
    column-gap: 10%;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    .back-btn {
      cursor: pointer;
    }
  }
  .add-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #58595b;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px auto 0;
  }
`
const ApproveBtn = styled(ConfirmBtn)`
  flex: 1;
  padding: 0 0.8rem;
  user-select: none;
`
export default IncreaseLP
