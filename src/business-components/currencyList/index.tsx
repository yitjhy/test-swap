import styled from 'styled-components'
import { TextInput } from '@/components/input'
import { Check } from 'react-feather'
import { ConfirmBtn } from '@/components/button'
import Image from 'next/image'
import Modal from '@/components/modal'
import NotTradedWaning from '@/business-components/currencyList/notTradedWaning'
import { useEffect, useState, FC, ChangeEvent } from 'react'
import { formatUnits } from 'ethers/lib/utils'
import { useRemoteCurrencyList, TCurrencyListItem, baseAddress } from '@/context/remoteCurrencyListContext'
import { judgeImgUrl } from '@/utils'
import { Global } from '@/types/global'
import useErc20Info from '@/hooks/contract/useERC20Info'
import useErc20InfoList from '@/hooks/useErc20InfoList'
import { constants } from 'ethers'

export type TSelectCurrencyProps = {
  checkedCurrency: Global.TErc20InfoWithPair
  onChecked?: (data: Global.TErc20InfoWithPair) => void
}
const SelectCurrency: FC<TSelectCurrencyProps> = ({ onChecked, checkedCurrency }) => {
  const [isWarningModalOpen, handleWarningModalOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [currencyList, setCurrencyList] = useState<Global.TErc20InfoWithPair[]>([])
  const { currencyList: currencyListByContext, update: updateCurrencyList } = useRemoteCurrencyList()
  const [searchAddress, setSearchAddress] = useState('')
  const [erc20ListByUserAdded, setErc20ListByUserAdded] = useState<string[]>([])

  const handleChecked = (data: Global.TErc20InfoWithPair) => {
    onChecked?.(data)
    setCurrencyList(currencyListByContext)
    setSearchValue('')
  }
  // const currencyList = useErc20InfoList([searchAddress])
  const searchErc20Info = useErc20Info(searchAddress)
  // console.log(searchErc20Info)
  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(e.target.value)
    const lowerCaseValue = value.toLowerCase()
    if (value) {
      if (value.length === 42) {
        setSearchAddress(value)
      } else {
        const filterCurrencyList = currencyListByContext.filter((item) => {
          return item.name.toLowerCase().includes(lowerCaseValue) || item.symbol.toLowerCase().includes(lowerCaseValue)
        })
        setCurrencyList(filterCurrencyList)
      }
    } else {
      setCurrencyList(currencyListByContext)
      setSearchAddress('')
    }
  }
  useEffect(() => {
    setCurrencyList(currencyListByContext)
  }, [currencyListByContext])
  useEffect(() => {
    if (searchErc20Info.symbol && searchValue && searchValue.length === 42) {
      setCurrencyList([searchErc20Info])
    }
  }, [searchErc20Info, searchValue])
  const onNotTradedWaningCancel = () => {
    handleWarningModalOpen(false)
  }
  const addThirdPartyCurrencyInStorage = () => {
    let list: string[] = [searchErc20Info.address]
    if (erc20ListByUserAdded && erc20ListByUserAdded.length > 0) {
      list = Array.from(new Set([...erc20ListByUserAdded, searchErc20Info.address]))
    }
    localStorage.setItem('erc20ListByUserAdded', JSON.stringify(list))
    setErc20ListByUserAdded(list)
    updateCurrencyList()
  }
  const onNotTradedWaningConfirm = () => {
    addThirdPartyCurrencyInStorage()
    handleChecked(searchErc20Info)
    handleWarningModalOpen(false)
  }
  useEffect(() => {
    const erc20ListByUserAdded = localStorage.getItem('erc20ListByUserAdded')
    if (erc20ListByUserAdded) {
      setErc20ListByUserAdded(JSON.parse(erc20ListByUserAdded))
    }
  }, [currencyListByContext])
  return (
    <SelectCurrencyWrapper>
      <Modal
        title=""
        content={<NotTradedWaning onConfirm={onNotTradedWaningConfirm} onCancel={onNotTradedWaningCancel} />}
        open={isWarningModalOpen}
        contentStyle={{ width: 480 }}
        onClose={handleWarningModalOpen}
      />
      <TextInput
        value={searchValue}
        onChange={onSearch}
        style={{
          height: '2.3rem',
          width: '100%',
          border: 'none',
          borderRadius: 0,
          background: '#262626',
          color: '#D9D9D9',
        }}
        placeholder="Search Name Or Paste Address"
      />
      <RecommendCurrency>
        {currencyListByContext.length > 0 &&
          currencyListByContext.slice(0, 4).map((item, index) => (
            <div
              className="currency-btn"
              key={index}
              style={{ opacity: checkedCurrency?.address === item.address ? 0.5 : 1 }}
              onClick={() => handleChecked(item as TCurrencyListItem)}
            >
              {/*<img src="" alt="" width={24} height={24} />*/}
              <div className="recommend-logo-wrapper">{item.symbol?.slice(0, 3)}</div>
              <span className="currency-symbol">{item.symbol}</span>
            </div>
          ))}
      </RecommendCurrency>
      <div className="split-line" />
      <div className="currency-list-wrapper">
        {currencyList.length > 0 ? (
          currencyList?.map((item, index) => {
            return (
              <div
                key={index}
                className="currency-item-wrapper"
                style={{ opacity: checkedCurrency?.address === item.address ? 0.5 : 1 }}
                onClick={(e) => {
                  if (baseAddress.includes(item.address) || erc20ListByUserAdded.includes(item.address)) {
                    handleChecked(item)
                  } else {
                    e.stopPropagation()
                    handleWarningModalOpen(true)
                  }
                }}
              >
                <div className="currency-base-info-wrapper">
                  {judgeImgUrl('') ? (
                    <img src={''} alt="" width={40} height={40} />
                  ) : (
                    <div className="logo-wrapper">{item.symbol?.slice(0, 3)}</div>
                  )}

                  <div className="currency-name-symbol-wrapper">
                    <span className="currency-name">{item.name}</span>
                    <span className="currency-symbol">{item.symbol}</span>
                  </div>
                  {!baseAddress.includes(item.address) && <Image src="/warning.png" alt="" width={15} height={15} />}
                </div>
                {index % 2 > -1 ? (
                  <div className="currency-balance-wrapper">
                    <span className="currency-balance">
                      {item.balance ? formatUnits(item.balance, item.decimals) : 0}
                    </span>
                    {checkedCurrency?.address === item.address && (
                      <span className="currency-status">
                        <Check size={20} color="rgb(251, 17, 142)" />
                      </span>
                    )}
                  </div>
                ) : (
                  <ConfirmBtn style={{ height: '2rem', padding: '0 1rem' }}>Import</ConfirmBtn>
                )}
              </div>
            )
          })
        ) : (
          <>
            {/*<div className="rotate-wrapper">*/}
            {/*  <SyncOutlined spin />*/}
            {/*</div>*/}
            <span className="no-data">No Results Found</span>
          </>
        )}
      </div>
    </SelectCurrencyWrapper>
  )
}
const RecommendCurrency = styled.div`
  display: flex;
  column-gap: 0.5rem;
  .currency-btn {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 6px 11px;
    color: #d9d9d9;
    background: #262626;
    column-gap: 0.55rem;
    cursor: pointer;
    .currency-logo {
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }
    .currency-symbol {
      font-size: 14px;
    }
  }
`
const SelectCurrencyWrapper = styled.div`
  /* width: 400px; */
  display: grid;
  row-gap: 18px;
  font-size: 16px;
  /* height: 60vh; */
  color: #d9d9d9;
  .logo-wrapper {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #f2f4f7;
    color: #131313;
    font-size: 13px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
  }
  .recommend-logo-wrapper {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #f2f4f7;
    color: #131313;
    font-size: 13px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
  }
  .currency-list-wrapper {
    display: grid;
    row-gap: 1.5rem;
    .currency-item-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      cursor: pointer;
      .currency-base-info-wrapper {
        display: flex;
        align-items: center;
        column-gap: 12px;
        .currency-logo {
          width: 40px;
          height: 40px;
        }
        .currency-name-symbol-wrapper {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          row-gap: 2px;
          .currency-name {
            color: #d9d9d9;
            font-size: 16px;
            display: block;
          }
          .currency-symbol {
            color: #7d7d7d;
            font-size: 12px;
            display: block;
          }
        }
      }
      .currency-balance-wrapper {
        display: flex;
        column-gap: 8px;
        align-items: center;
        .currency-balance {
          font-size: 14px;
          max-width: 200px;
          overflow-wrap: anywhere;
        }
        .currency-status {
        }
      }
    }
    .rotate-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #383838;
      //div {
      //  animation: wave 1.5s infinite;
      //  @keyframes wave {
      //    0% {
      //      transform: rotate(0);
      //    }
      //    50% {
      //      transform: rotate(180deg);
      //    }
      //    100% {
      //      transform: rotate(360deg);
      //    }
      //  }
      //}
    }
  }
  .no-data {
    font-size: 16px;
    color: #d9d9d9;
    padding: 4rem 0;
    display: block;
    text-align: center;
  }
  .split-line {
    border-top: 1px solid #262626;
  }
`
export default SelectCurrency
