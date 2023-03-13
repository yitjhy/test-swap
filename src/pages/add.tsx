import styled from 'styled-components'
import { ChevronLeft, Plus } from 'react-feather'
import { Settings } from 'react-feather'
import SwapSection, { TSwapSectionProps } from '@/business-components/swap-section'
import SubmitBtn from '@/components/submitBtn'
import Rate from '@/views/add/rate'
import Tip from '@/views/add/tip'
import LPShare from '@/views/add/lp-share'
import { ConfirmBtn } from '@/components/button'
import Modal from '@/components/modal'
import Config from '@/views/swap/config'
import { useEffect, useState } from 'react'
import useERC20Approved from '@/hooks/contract/useERC20Approved'
import { TCurrencyListItem } from '@/context/remoteCurrencyListContext'
import useCreatePair from '@/hooks/useCreatePair'
import { formatEther, parseUnits } from 'ethers/lib/utils'
import useGetPairContract from '@/hooks/useGetPairContract'
import { ABI } from '@/utils/abis'
import { getContract } from '@/hooks/contract/useContract'
import { useDialog } from '@/components/dialog'

const IncreaseLP = () => {
  const [isConfigModalOpen, handleConfigModalOpen] = useState(false)
  const [checkedFromCurrency, setCheckedFromCurrency] = useState<TCurrencyListItem>({} as TCurrencyListItem)
  const [checkedToCurrency, setCheckedToCurrency] = useState<TCurrencyListItem>({} as TCurrencyListItem)
  const [inputValueByTo, setInputValueByTo] = useState(0)
  const [inputValueByFrom, setInputValueByFrom] = useState(0)
  const { addLiquidity } = useCreatePair()
  const { getPairContractAddress } = useGetPairContract()
  const getPairContract = async () => {
    const pairContractAddress = await getPairContractAddress(checkedFromCurrency.address, checkedToCurrency.address)
    console.log(pairContractAddress)
    const pairContract = await getContract(pairContractAddress, ABI.pair)
    console.log(pairContract)
    // const res = await pairContract?.getReserves()
    console.log(111)
    // console.log(res)
  }
  useEffect(() => {
    if (checkedFromCurrency.address && checkedToCurrency.address) {
      getPairContract().then()
    }
  }, [checkedFromCurrency.address, checkedToCurrency.address])
  const onSelectedCurrencyByFrom: TSwapSectionProps['onSelectedCurrency'] = (balance, currency) => {
    setCheckedFromCurrency(currency)
  }
  const onSelectedCurrencyByTo: TSwapSectionProps['onSelectedCurrency'] = (balance, currency) => {
    setCheckedToCurrency(currency)
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
  const { approved: isApprovedCurrencyFrom, approve: approveCurrencyFrom } = useERC20Approved(
    checkedFromCurrency.address,
    '0xB63940335F8c66BD1232077eBA6008370a0Edb47'
  )
  const { approved: isApprovedCurrencyTo, approve: approveCurrencyTo } = useERC20Approved(
    checkedToCurrency.address,
    '0xB63940335F8c66BD1232077eBA6008370a0Edb47'
  )
  const { close, openDialog } = useDialog()
  const handleSubmit = async () => {
    openDialog({ title: 'Add Liquidity', desc: 'adding' })
    const operation = await addLiquidity(
      checkedFromCurrency.address,
      checkedToCurrency.address,
      parseUnits(String(inputValueByFrom), checkedFromCurrency.decimals),
      parseUnits(String(inputValueByTo), checkedToCurrency.decimals)
    )
    console.log(operation)
    await operation.wait()
    close()
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
    <IncreaseLPWrapper>
      <Modal
        contentStyle={{ width: 480 }}
        title="Settings"
        content={<Config />}
        open={isConfigModalOpen}
        onClose={handleConfigModalOpen}
      />
      <div style={{ background: '#1a1a1a', padding: '1rem' }}>
        <div className="header">
          <span className="back-btn">
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
        <Rate />
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
        <LPShare />
      </div>
    </IncreaseLPWrapper>
  )
}

const IncreaseLPWrapper = styled.div`
  color: #d9d9d9;
  padding: 1rem;
  max-width: 480px;
  margin: 0 auto;
  margin-top: 68px;
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
