import styled from 'styled-components'
import { ChevronLeft, Plus } from 'react-feather'
import { Settings } from 'react-feather'
import SwapSection, { TSwapSectionProps } from '@/business-components/swap-section'
import SubmitBtn from '@/components/submitBtn'
import Rate, { TRateProps } from '@/views/add/rate'
import Tip from '@/views/add/tip'
import LPDetail, { TLPDetailProps } from '@/views/add/lp-detail'
import { ConfirmBtn } from '@/components/button'
import Modal from '@/components/modal'
import Config from '@/views/swap/config'
import { useEffect, useState } from 'react'
import useERC20Approved from '@/hooks/contract/useERC20Approved'
import { TCurrencyListItem } from '@/context/remoteCurrencyListContext'
import useCreatePair from '@/hooks/useCreatePair'
import { formatEther, parseUnits, formatUnits } from 'ethers/lib/utils'
import useGetPairContract from '@/hooks/useGetPairContract'
import { ABI } from '@/utils/abis'
import { getContract } from '@/hooks/contract/useContract'
import { useDialog } from '@/components/dialog'
import { useSigner } from '@/hooks/contract/useSigner'
import { contractAddress, invalidAddress, platFormAddress } from '@/utils/enum'
import useLPDetail from '@/hooks/usePaireDetail'
import useLiquidityRate from '@/hooks/useLiquidityRate'
import { useRouter } from 'next/router'
import { getAddress } from '@/utils'

const IncreaseLP = () => {
  const router = useRouter()
  const { query } = useRouter()
  const [isConfigModalOpen, handleConfigModalOpen] = useState(false)
  const [checkedFromCurrency, setCheckedFromCurrency] = useState<TCurrencyListItem>({} as TCurrencyListItem)
  const [checkedToCurrency, setCheckedToCurrency] = useState<TCurrencyListItem>({} as TCurrencyListItem)
  const [inputValueByTo, setInputValueByTo] = useState(0)
  const [inputValueByFrom, setInputValueByFrom] = useState(0)
  const [shareOfPool, setShareOfPool] = useState('0')
  const [LPDetailData, setLPDetailData] = useState<TLPDetailProps & { rate: TRateProps['rate']; pairAddress: string }>(
    {} as any
  )
  const { getLPDetail } = useLPDetail()
  const { getLiquidityRate } = useLiquidityRate(
    {
      address: checkedFromCurrency.address,
      inputValue: inputValueByFrom,
    },
    {
      address: checkedToCurrency.address,
      inputValue: inputValueByTo,
    }
  )
  const { addLiquidity, addLiquidityETH } = useCreatePair()
  const { getPairContractAddress } = useGetPairContract()
  const signer = useSigner()
  const onSelectedCurrencyByFrom: TSwapSectionProps['onSelectedCurrency'] = (balance, currency) => {
    setCheckedFromCurrency(currency)
  }
  const onSelectedCurrencyByTo: TSwapSectionProps['onSelectedCurrency'] = (balance, currency) => {
    setCheckedToCurrency(currency)
  }
  const onInputByFrom: TSwapSectionProps['onInput'] = async (value) => {
    setInputValueByFrom(value)
    const { fromAddress, toAddress } = getAddress(checkedFromCurrency.address, checkedToCurrency.address)
    const pairContractAddress = await getPairContractAddress(fromAddress, toAddress)
    if (pairContractAddress !== invalidAddress) {
      const pairContract = await getContract(pairContractAddress, ABI.pair, signer)
      const pairAmount = await pairContract?.getReserves()
      const token0Address = await pairContract?.token0()
      const token1Address = await pairContract?.token1()
      const token0Contract = await getContract(token0Address, ABI.ERC20, signer)
      const token1Contract = await getContract(token1Address, ABI.ERC20, signer)
      const token0Decimal = await token0Contract?.decimals()
      const token1Decimal = await token1Contract?.decimals()
      if (token0Address === fromAddress) {
        const res = pairAmount._reserve1.mul(parseUnits(String(value), token0Decimal)).div(pairAmount._reserve0)
        setInputValueByTo(Number(formatUnits(res, token1Decimal)))
      } else {
        const res = pairAmount._reserve0.mul(parseUnits(String(value), token1Decimal)).div(pairAmount._reserve1)
        setInputValueByTo(Number(formatUnits(res, token0Decimal)))
      }
    }
  }
  const onInputByTo: TSwapSectionProps['onInput'] = async (value) => {
    setInputValueByTo(value)
    const { fromAddress, toAddress } = getAddress(checkedFromCurrency.address, checkedToCurrency.address)
    const pairContractAddress = await getPairContractAddress(fromAddress, toAddress)
    if (pairContractAddress !== invalidAddress) {
      const pairContract = await getContract(pairContractAddress, ABI.pair, signer)
      const pairAmount = await pairContract?.getReserves()
      const token0Address = await pairContract?.token0()
      const token1Address = await pairContract?.token1()
      const token0Contract = await getContract(token0Address, ABI.ERC20, signer)
      const token1Contract = await getContract(token1Address, ABI.ERC20, signer)
      const token0Decimal = await token0Contract?.decimals()
      const token1Decimal = await token1Contract?.decimals()
      if (token0Address === fromAddress) {
        const res = pairAmount._reserve0.mul(parseUnits(String(value), token1Decimal)).div(pairAmount._reserve1)
        setInputValueByFrom(Number(formatUnits(res, token0Decimal)))
      } else {
        const res = pairAmount._reserve1.mul(parseUnits(String(value), token0Decimal)).div(pairAmount._reserve0)
        setInputValueByFrom(Number(formatUnits(res, token1Decimal)))
      }
    }
  }
  const handleMaxByFrom: TSwapSectionProps['onMax'] = (value) => {
    setInputValueByFrom(value)
  }
  const handleMaxByTo: TSwapSectionProps['onMax'] = (value) => {
    setInputValueByTo(value)
  }
  const { approved: isApprovedCurrencyFrom, approve: approveCurrencyFrom } = useERC20Approved(
    checkedFromCurrency.address,
    contractAddress.router
  )
  const { approved: isApprovedCurrencyTo, approve: approveCurrencyTo } = useERC20Approved(
    checkedToCurrency.address,
    contractAddress.router
  )
  const { close, openDialog } = useDialog()
  const handleSubmit = async () => {
    openDialog({ title: 'Add Liquidity', desc: 'adding' })
    if (checkedFromCurrency.address === platFormAddress) {
      const operation = await addLiquidityETH(
        checkedToCurrency.address,
        parseUnits(String(inputValueByTo), checkedToCurrency.decimals),
        {
          value: parseUnits(String(inputValueByFrom), checkedFromCurrency.decimals),
        }
      )
      await operation.wait()
      close()
    }
    if (checkedToCurrency.address === platFormAddress) {
      debugger
      const operation = await addLiquidityETH(
        checkedFromCurrency.address,
        parseUnits(String(inputValueByFrom), checkedFromCurrency.decimals),
        {
          value: parseUnits(String(checkedToCurrency), checkedToCurrency.decimals),
        }
      )
      await operation.wait()
      close()
    }
    if (checkedToCurrency.address !== platFormAddress && checkedFromCurrency.address !== platFormAddress) {
      const operation = await addLiquidity(
        checkedFromCurrency.address,
        checkedToCurrency.address,
        parseUnits(String(inputValueByFrom), checkedFromCurrency.decimals),
        parseUnits(String(inputValueByTo), checkedToCurrency.decimals)
      )
      await operation.wait()
      close()
    }
  }
  const getSubmitBtnText = () => {
    if (!checkedFromCurrency.address || !checkedToCurrency.address) {
      return 'Select Token'
    }
    if (inputValueByFrom === 0 || inputValueByTo === 0) {
      return 'Enter the number of Token'
    }
    if (
      checkedToCurrency.address &&
      parseUnits(String(inputValueByTo), checkedToCurrency.decimals).gt(checkedToCurrency.balance)
    ) {
      return 'Insufficient balance'
    }
    if (
      checkedFromCurrency.address &&
      parseUnits(String(inputValueByFrom), checkedFromCurrency.decimals).gt(checkedFromCurrency.balance)
    ) {
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
      parseUnits(String(inputValueByTo), checkedToCurrency.decimals).lte(checkedToCurrency.balance) &&
      parseUnits(String(inputValueByFrom), checkedFromCurrency.decimals).lte(checkedFromCurrency.balance)
    ) {
      return false
    }
    return true
  }
  useEffect(() => {
    if (checkedFromCurrency.address && checkedToCurrency.address && inputValueByFrom && inputValueByTo) {
      getLiquidityRate().then((data) => {
        console.log(data)
        setShareOfPool(data)
      })
    }
  }, [checkedFromCurrency.address, checkedToCurrency.address, inputValueByFrom, inputValueByTo, getLiquidityRate])
  useEffect(() => {
    if (checkedFromCurrency.address && checkedToCurrency.address) {
      console.log(checkedFromCurrency.address, checkedToCurrency.address)
      const { fromAddress, toAddress } = getAddress(checkedFromCurrency.address, checkedToCurrency.address)
      setLPDetailData({} as any)
      getPairContractAddress(fromAddress, toAddress).then((address: string) => {
        console.log(address)
        getLPDetail(address).then((data) => {
          console.log(data)
          setLPDetailData(data)
        })
      })
    }
  }, [checkedFromCurrency.address, checkedToCurrency.address, getLPDetail])
  useEffect(() => {
    if (query.address) {
      getLPDetail(query.address as string).then((data) => {
        console.log(data)
        setLPDetailData(data)
        setCheckedFromCurrency(data.tokens[0])
        setCheckedToCurrency(data.tokens[1])
        // setInputValueByFrom(Number(formatUnits(data.tokens[0].balance, data.tokens[0].decimals)))
        // setInputValueByTo(Number(formatUnits(data.tokens[1].balance, data.tokens[1].decimals)))
      })
    }
  }, [query.address, getLPDetail])
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
          <span
            className="back-btn"
            onClick={() => {
              router.push('/lp').then()
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
        {LPDetailData.pairAddress &&
        LPDetailData.pairAddress !== invalidAddress &&
        LPDetailData.rate &&
        LPDetailData.rate.length > 0 &&
        checkedFromCurrency.address &&
        checkedToCurrency.address ? (
          <Rate shareOfPool={shareOfPool} rate={LPDetailData.rate} />
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
        {LPDetailData.tokens && LPDetailData.tokens.length > 0 && <LPDetail data={LPDetailData} />}
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
