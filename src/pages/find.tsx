import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { CaretDownOutlined, PlusCircleOutlined } from '@ant-design/icons'
import CurrencyList, { TSelectCurrencyProps } from '@/business-components/currencyList'
import Modal from '@/components/modal'
import { TCurrencyListItem } from '@/context/remoteCurrencyListContext'
import useGetPairContract from '@/hooks/usePairAddress'
import { invalidAddress } from '@/utils/enum'
import { useRouter } from 'next/router'
import { getAddress } from '@/utils'

function Find() {
  const router = useRouter()
  const goLP = () => {
    router.push('/lp').then()
  }
  const [isFromCurrencyListModalOpen, handleFromCurrencyListModalOpen] = useState(false)
  const [isToCurrencyListModalOpen, handleToCurrencyListModalOpen] = useState(false)
  const [fromCurrency, setFromCurrency] = useState<TCurrencyListItem>({} as TCurrencyListItem)
  const [toCurrency, setToCurrency] = useState<TCurrencyListItem>({} as TCurrencyListItem)
  const { getPairContractAddress } = useGetPairContract()
  const [pairAddress, setPairAddress] = useState('')
  const handleSelectedFromCurrency: TSelectCurrencyProps['onChecked'] = (data) => {
    handleFromCurrencyListModalOpen(false)
    setFromCurrency(data)
  }
  const handleSelectedToCurrency: TSelectCurrencyProps['onChecked'] = (data) => {
    handleToCurrencyListModalOpen(false)
    setToCurrency(data)
  }
  const getPairAddress = async () => {
    const { fromAddress, toAddress } = getAddress(fromCurrency.address, toCurrency.address)
    const pairAddress = await getPairContractAddress(fromAddress, toAddress)
    if (pairAddress !== invalidAddress) {
      setPairAddress(pairAddress)
    } else {
      console.log('pair不存在')
      console.log(pairAddress)
      setPairAddress(pairAddress)
    }
  }
  const submit = () => {
    const pairAddressListFromStorage = localStorage.getItem('pairAddressList')
    if (pairAddressListFromStorage) {
      const pairAddressList = JSON.parse(pairAddressListFromStorage)
      localStorage.setItem('pairAddressList', JSON.stringify(Array.from(new Set([...pairAddressList, pairAddress]))))
    } else {
      localStorage.setItem('pairAddressList', JSON.stringify([pairAddress]))
    }
    goLP()
  }
  useEffect(() => {
    if (fromCurrency.address && toCurrency.address) {
      getPairAddress().then()
    }
  }, [fromCurrency, toCurrency])
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
      <div className="collapse-header">Import Pool</div>
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
              ? 'Add Liquidity'
              : 'Invalid Pair'}
          </button>
        </div>
      </div>
    </LPWrapper>
  )
}
const LPWrapper = styled.div`
  max-width: 480px;
  margin: 0 auto;
  margin-top: 68px;
  background: #1a1a1a;
  padding: 21px 19px;
  row-gap: 14px;
  display: grid;
  .collapse-header {
    display: flex;
    column-gap: 1rem;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    margin-bottom: 40px;
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
