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
import { formatEther, parseUnits, formatUnits } from 'ethers/lib/utils'
import useGetPairContract from '@/hooks/useGetPairContract'
import { ABI } from '@/utils/abis'
import { getContract } from '@/hooks/contract/useContract'
import { useDialog } from '@/components/dialog'
import { useSigner } from '@/hooks/contract/useSigner'
import useAmountOut from '@/hooks/useAmountOut'
import { contractAddress, invalidAddress, platFormAddress } from '@/utils/enum'
import { BigNumber } from 'ethers'
import { useWeb3React } from '@web3-react/core'
// import { formatUnits } from '@ethersproject/units/src.ts'

const IncreaseLP = () => {
  const [isConfigModalOpen, handleConfigModalOpen] = useState(false)
  const [checkedFromCurrency, setCheckedFromCurrency] = useState<TCurrencyListItem>({} as TCurrencyListItem)
  const [checkedToCurrency, setCheckedToCurrency] = useState<TCurrencyListItem>({} as TCurrencyListItem)
  const [inputValueByTo, setInputValueByTo] = useState(0)
  const [inputValueByFrom, setInputValueByFrom] = useState(0)
  const [pairAddress, setPairAddress] = useState('')
  const [shareOfPool, setShareOfPool] = useState(0)
  const [rate, setRate] = useState<{ from2To: string; to2from: string }>({ from2To: '', to2from: '' })
  const { addLiquidity, addLiquidityETH } = useCreatePair()
  const { getPairContractAddress } = useGetPairContract()
  const { getAmountOut } = useAmountOut()
  const { account } = useWeb3React()
  const signer = useSigner()
  const getLiquidityRate = async () => {
    const pairContractAddress = await getPairContractAddress(checkedFromCurrency.address, checkedToCurrency.address)
    if (pairContractAddress !== invalidAddress) {
      setPairAddress(pairContractAddress)
      const pairContract = await getContract(pairContractAddress, ABI.pair, signer)
      console.log(pairContract)
      const accountBalance = await pairContract?.balanceOf(account)
      console.log('accountBalance-----', formatEther(accountBalance))
      const pairAmount = await pairContract?.getReserves()
      const totalSupplyBigNumber = await pairContract?.totalSupply()
      const token0 = await pairContract?.token0()
      const poolTotalSupply = formatEther(totalSupplyBigNumber)
      console.log('poolTotalSupply----', poolTotalSupply)
      const _reserve0amount = formatEther(pairAmount._reserve0)
      console.log('_reserve0amount----', _reserve0amount)
      console.log(Number(accountBalance) / Number(poolTotalSupply))
      const res = BigNumber.from(pairAmount._reserve0)
        .mul(BigNumber.from(accountBalance))
        .div(BigNumber.from(totalSupplyBigNumber))
      console.log('res---', formatEther(res))
      console.log('rate----', (Number(accountBalance) / Number(poolTotalSupply)) * Number(_reserve0amount))
      if (poolTotalSupply !== '0') {
        // 已经有人添加过流动性
        const token0 = await pairContract?.token0()

        let liquidity = 0
        if (token0 === checkedFromCurrency.address) {
          liquidity = Math.min(
            (inputValueByFrom * Number(poolTotalSupply)) / Number(formatEther(pairAmount._reserve0)),
            (inputValueByTo * Number(poolTotalSupply)) / Number(formatEther(pairAmount._reserve1))
          )
        } else {
          liquidity = Math.min(
            (inputValueByFrom * Number(poolTotalSupply)) / Number(formatEther(pairAmount._reserve1)),
            (inputValueByTo * Number(poolTotalSupply)) / Number(formatEther(pairAmount._reserve0))
          )
        }
        // const liquidity = Math.min(
        //   (inputValueByFrom * Number(totalSupply)) / Number(formatEther(pairAmount._reserve0)),
        //   (inputValueByTo * Number(totalSupply)) / Number(formatEther(pairAmount._reserve1))
        // )
        console.log(22)
        console.log(liquidity / (Number(poolTotalSupply) + liquidity))
        setShareOfPool(liquidity / (Number(poolTotalSupply) + liquidity))
      } else {
        // 还没人添加过流动性
        const liquidity = Math.sqrt(inputValueByFrom * inputValueByTo) - 1000
        setShareOfPool(liquidity / (Number(poolTotalSupply) + liquidity))
      }
    } else {
      console.log('pair不存在')
      console.log(pairContractAddress)
    }
  }
  const getRate = async () => {
    const pairContractAddress = await getPairContractAddress(checkedFromCurrency.address, checkedToCurrency.address)
    if (pairContractAddress !== invalidAddress) {
      setPairAddress(pairContractAddress)
      const pairContract = await getContract(pairContractAddress, ABI.pair, signer)
      const pairAmount = await pairContract?.getReserves()

      const token0 = await pairContract?.token0()

      let amountOut1 = await getAmountOut(parseUnits('1', 18), pairAmount._reserve0, pairAmount._reserve1)
      console.log(amountOut1)
      // const rateOfFrom2To = formatEther(amountOut1)
      const rateOfFrom2To = formatUnits(amountOut1, 18)
      let amountOut2 = await getAmountOut(parseUnits('1', 18), pairAmount._reserve1, pairAmount._reserve0)
      const rateOfTo2from = formatEther(amountOut2)
      console.log('rateOfFrom2To---', rateOfFrom2To)
      console.log('rateOfTo2from---', rateOfTo2from)
      if (token0 === checkedFromCurrency.address) {
        setRate({ from2To: rateOfFrom2To, to2from: rateOfTo2from })
      } else {
        setRate({ from2To: rateOfTo2from, to2from: rateOfFrom2To })
      }
    } else {
      console.log('pair不存在')
      console.log(pairContractAddress)
    }
  }
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
      console.log(checkedToCurrency.address, parseUnits(String(inputValueByTo), checkedToCurrency.decimals), {
        value: parseUnits(String(inputValueByFrom), checkedFromCurrency.decimals),
      })
      console.log(11111111111)
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
    if (checkedToCurrency.address !== platFormAddress || checkedFromCurrency.address !== platFormAddress) {
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
  useEffect(() => {
    if (checkedFromCurrency.address && checkedToCurrency.address && inputValueByFrom && inputValueByTo) {
      getLiquidityRate().then()
    }
  }, [checkedFromCurrency.address, checkedToCurrency.address, inputValueByFrom, inputValueByTo])
  useEffect(() => {
    if (checkedFromCurrency.address && checkedToCurrency.address) {
      getRate().then()
    }
  }, [checkedFromCurrency.address, checkedToCurrency.address])
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
        {pairAddress &&
        pairAddress !== invalidAddress &&
        rate.from2To &&
        rate.to2from &&
        checkedFromCurrency.address &&
        checkedToCurrency.address ? (
          <Rate
            shareOfPool={shareOfPool}
            rateFrom2To={rate.from2To}
            rateTo2From={rate.to2from}
            fromCurrency={checkedFromCurrency}
            toCurrency={checkedToCurrency}
          />
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
