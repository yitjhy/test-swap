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
import { BigNumber } from 'ethers'
import { useWeb3React } from '@web3-react/core'

const IncreaseLP = () => {
  const [isConfigModalOpen, handleConfigModalOpen] = useState(false)
  const [checkedFromCurrency, setCheckedFromCurrency] = useState<TCurrencyListItem>({} as TCurrencyListItem)
  const [checkedToCurrency, setCheckedToCurrency] = useState<TCurrencyListItem>({} as TCurrencyListItem)
  const [inputValueByTo, setInputValueByTo] = useState(0)
  const [inputValueByFrom, setInputValueByFrom] = useState(0)
  const [shareOfPool, setShareOfPool] = useState(0)
  const [LPDetailData, setLPDetailData] = useState<TLPDetailProps & { rate: TRateProps['rate']; pairAddress: string }>(
    {} as any
  )
  const [pairContractAddress, setPairContractAddress] = useState('')
  const { getLPDetail } = useLPDetail()
  const { addLiquidity, addLiquidityETH } = useCreatePair()
  const { getPairContractAddress } = useGetPairContract()
  const signer = useSigner()
  const { account } = useWeb3React()
  const getLiquidityRate = async () => {
    const pairContractAddress = await getPairContractAddress(checkedFromCurrency.address, checkedToCurrency.address)
    if (pairContractAddress !== invalidAddress) {
      const pairContract = await getContract(pairContractAddress, ABI.pair, signer)
      const pairAmount = await pairContract?.getReserves()
      const totalSupplyBigNumber = await pairContract?.totalSupply()
      const poolTotalSupply = formatEther(totalSupplyBigNumber)
      if (!totalSupplyBigNumber.isZero()) {
        // 已经有人添加过流动性
        const token0Address = await pairContract?.token0()
        const token1Address = await pairContract?.token1()
        const token0Contract = await getContract(token0Address, ABI.ERC20, signer)
        const token1Contract = await getContract(token1Address, ABI.ERC20, signer)
        const token0Decimal = await token0Contract?.decimals()
        const token1Decimal = await token1Contract?.decimals()
        let liquidity = 0
        if (token1Address === checkedFromCurrency.address) {
          // const aa = BigNumber.from(inputValueByFrom).mul(totalSupplyBigNumber).div(pairAmount._reserve0)
          // const bb = BigNumber.from(inputValueByTo).mul(totalSupplyBigNumber).div(pairAmount._reserve1)
          // console.log(aa.toNumber())
          // console.log(bb.toNumber())
          // console.log((inputValueByFrom * Number(poolTotalSupply)) / Number(formatEther(pairAmount._reserve0)))
          // console.log((inputValueByTo * Number(poolTotalSupply)) / Number(formatEther(pairAmount._reserve1)))
          // console.log(
          //   parseUnits('1', 18)
          //     .mul(BigNumber.from(100))
          //     .div(totalSupplyBigNumber.add(BigNumber.from(100)))
          //     .toNumber()
          // )
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
  const onSelectedCurrencyByFrom: TSwapSectionProps['onSelectedCurrency'] = (balance, currency) => {
    setCheckedFromCurrency(currency)
  }
  const onSelectedCurrencyByTo: TSwapSectionProps['onSelectedCurrency'] = (balance, currency) => {
    setCheckedToCurrency(currency)
  }
  const onInputByFrom: TSwapSectionProps['onInput'] = async (value) => {
    setInputValueByFrom(value)
    if (checkedFromCurrency.address && checkedToCurrency.address) {
      const pairContractAddress = await getPairContractAddress(checkedFromCurrency.address, checkedToCurrency.address)
      if (pairContractAddress !== invalidAddress) {
        const pairContract = await getContract(pairContractAddress, ABI.pair, signer)
        const pairAmount = await pairContract?.getReserves()
        const token0Address = await pairContract?.token0()
        const token1Address = await pairContract?.token1()
        const token0Contract = await getContract(token0Address, ABI.ERC20, signer)
        const token1Contract = await getContract(token1Address, ABI.ERC20, signer)
        const token0Decimal = await token0Contract?.decimals()
        const token1Decimal = await token1Contract?.decimals()
        if (token0Address === checkedFromCurrency.address) {
          const res = pairAmount._reserve1.mul(parseUnits(String(value), token0Decimal)).div(pairAmount._reserve0)
          setInputValueByTo(Number(formatUnits(res, token1Decimal)))
        } else {
          const res = pairAmount._reserve0.mul(parseUnits(String(value), token1Decimal)).div(pairAmount._reserve1)
          setInputValueByTo(Number(formatUnits(res, token0Decimal)))
        }
      }
    }
  }
  const onInputByTo: TSwapSectionProps['onInput'] = async (value) => {
    setInputValueByTo(value)
    if (checkedFromCurrency.address && checkedToCurrency.address) {
      const pairContractAddress = await getPairContractAddress(checkedFromCurrency.address, checkedToCurrency.address)
      if (pairContractAddress !== invalidAddress) {
        const pairContract = await getContract(pairContractAddress, ABI.pair, signer)
        const pairAmount = await pairContract?.getReserves()
        const token0Address = await pairContract?.token0()
        const token1Address = await pairContract?.token1()
        const token0Contract = await getContract(token0Address, ABI.ERC20, signer)
        const token1Contract = await getContract(token1Address, ABI.ERC20, signer)
        const token0Decimal = await token0Contract?.decimals()
        const token1Decimal = await token1Contract?.decimals()
        if (token0Address === checkedFromCurrency.address) {
          const res = pairAmount._reserve0.mul(parseUnits(String(value), token1Decimal)).div(pairAmount._reserve1)
          setInputValueByFrom(Number(formatUnits(res, token0Decimal)))
        } else {
          const res = pairAmount._reserve1.mul(parseUnits(String(value), token0Decimal)).div(pairAmount._reserve0)
          setInputValueByFrom(Number(formatUnits(res, token1Decimal)))
        }
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
  }, [checkedFromCurrency.address, checkedToCurrency.address, inputValueByFrom, inputValueByTo, getLiquidityRate])
  useEffect(() => {
    if (checkedFromCurrency.address && checkedToCurrency.address) {
      getPairContractAddress(checkedFromCurrency.address, checkedToCurrency.address).then((address: string) => {
        getLPDetail(address).then((data) => {
          console.log(data)
          setLPDetailData(data)
        })
      })
    }
  }, [checkedFromCurrency.address, checkedToCurrency.address, getLPDetail])
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
