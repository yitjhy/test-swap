import styled from 'styled-components'
import { ChevronLeft, HelpCircle } from 'react-feather'
import { Settings } from 'react-feather'
import LPDetail from '@/views/add/lp-detail'
import { ConfirmBtn } from '@/components/button'
import Modal from '@/components/modal'
import Config, { TConfig } from '@/views/add/config'
import RemoveSection, { TRemoveSection } from '@/views/remove/remove-section'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import usePairInfo from '@/hooks/usePairInfo'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import useRemoveLiquidity from '@/hooks/useRemoveLiquidity'
import { BigNumber, constants } from 'ethers'
import useERC20Approved from '@/hooks/contract/useERC20Approved'
import { contractAddress } from '@/utils/enum'
import { isSameAddress } from '@/utils/address'
import moment from 'moment'
import VideoBg from '@/business-components/videoBg'
import Popover from '@/components/popover'
import useMobile from '@/hooks/useMobile'
import { useWeb3React } from '@web3-react/core'
import { useWallet } from '@/context/WalletContext'

const RemoveLP = () => {
  const { account } = useWeb3React()
  const { active } = useWallet()
  const isMobile = useMobile()
  const router = useRouter()
  const { removeLiquidity, removeLiquidityETH } = useRemoveLiquidity()
  const [slippage, setSlippage] = useState<number>(0)
  const [deadline, setDeadline] = useState<number>(0)
  const [isExpertMode, setIsExpertMode] = useState(false)
  const [isConfigModalOpen, handleConfigModalOpen] = useState(false)
  const [liquidity, setLiquidity] = useState<BigNumber>()
  const { query } = useRouter()
  const { pairDetail, updatePairDetail } = usePairInfo(query.address as string)

  const { approved, approve } = useERC20Approved(
    pairDetail.pairAddress,
    contractAddress.router,
    liquidity || constants.Zero
  )
  const [inputFromLiquidity, setInputFromLiquidity] = useState(constants.Zero)
  const [inputToLiquidity, setInputToLiquidity] = useState(constants.Zero)
  const onLiquidityChange: TRemoveSection['onLiquidityChange'] = (liquidity, inputFromLiquidity, inputToLiquidity) => {
    setLiquidity(liquidity)
    setInputFromLiquidity(inputFromLiquidity)
    setInputToLiquidity(inputToLiquidity)
  }
  const goConnectWallet = async () => {
    await active('metaMask')
  }
  const handleRemove = async () => {
    let res = false
    const _deadline = moment()
      .add(deadline * 60, 'second')
      .unix()
    if (pairDetail.tokens.length && !liquidity?.isZero() && approved && pairDetail.pairAddress) {
      if (isSameAddress(pairDetail.tokens[0].address, constants.AddressZero)) {
        let erc20LiquidityTokenMin = inputToLiquidity
          .mul(parseUnits(`${100 - slippage}`, 10))
          .div(parseUnits('100', 10))
        let ethLiquidityTokenMin = inputFromLiquidity
          .mul(parseUnits(`${100 - slippage}`, 10))
          .div(parseUnits('100', 10))
        if (isExpertMode) {
          erc20LiquidityTokenMin = constants.Zero
          ethLiquidityTokenMin = constants.Zero
        }
        res = await removeLiquidityETH(
          pairDetail.tokens[1].address,
          liquidity as BigNumber,
          erc20LiquidityTokenMin,
          ethLiquidityTokenMin,
          _deadline
        )
      }
      if (isSameAddress(pairDetail.tokens[1].address, constants.AddressZero)) {
        let erc20LiquidityTokenMin = inputFromLiquidity
          .mul(parseUnits(`${100 - slippage}`, 10))
          .div(parseUnits('100', 10))
        let ethLiquidityTokenMin = inputToLiquidity.mul(parseUnits(`${100 - slippage}`, 10)).div(parseUnits('100', 10))
        if (isExpertMode) {
          erc20LiquidityTokenMin = constants.Zero
          ethLiquidityTokenMin = constants.Zero
        }
        res = await removeLiquidityETH(
          pairDetail.tokens[0].address,
          liquidity as BigNumber,
          erc20LiquidityTokenMin,
          ethLiquidityTokenMin,
          _deadline
        )
      }
      if (
        !isSameAddress(pairDetail.tokens[0].address, constants.AddressZero) &&
        !isSameAddress(pairDetail.tokens[1].address, constants.AddressZero)
      ) {
        let fromLiquidityTokenMin = inputFromLiquidity
          .mul(parseUnits(`${100 - slippage}`, 10))
          .div(parseUnits('100', 10))
        let toLiquidityTokenMin = inputToLiquidity.mul(parseUnits(`${100 - slippage}`, 10)).div(parseUnits('100', 10))
        if (isExpertMode) {
          fromLiquidityTokenMin = constants.Zero
          toLiquidityTokenMin = constants.Zero
        }
        res = await removeLiquidity(
          pairDetail.tokens[0].address,
          pairDetail.tokens[1].address,
          liquidity as BigNumber,
          fromLiquidityTokenMin,
          toLiquidityTokenMin,
          _deadline
        )
      }
      if (res) updatePairDetail()
    }
  }
  const onSlippageChange: TConfig['onSlippageChange'] = (value) => {
    setSlippage(value)
  }
  const onDeadlineChange: TConfig['onDeadlineChange'] = (value) => {
    setDeadline(value)
  }
  const onExpertModeChange: TConfig['onExpertModeChange'] = (value) => {
    setIsExpertMode(value)
  }
  return (
    <RemoveLPWrapper>
      <Modal
        contentStyle={{ width: 480 }}
        title="Settings"
        content={
          <Config
            storageKey="removeConfig"
            onDeadlineChange={onDeadlineChange}
            onSlippageChange={onSlippageChange}
            onExpertModeChange={onExpertModeChange}
          />
        }
        open={isConfigModalOpen}
        onClose={handleConfigModalOpen}
      />
      {!isMobile && <VideoBg src="https://d26w3tglonh3r.cloudfront.net/video/liquidity.mp4" />}
      <div style={{ position: 'relative', zIndex: 5 }}>
        <div style={{ background: '#1a1a1a', padding: '1rem 1rem 2rem' }}>
          <div className="header">
            <span
              className="back-btn"
              onClick={() => {
                router.push('/lp').then()
              }}
            >
              <ChevronLeft size={30} />
            </span>
            <span style={{ display: 'flex', columnGap: 5 }}>
              Remove
              <span className="label-tip">
                <Popover
                  content={
                    <TipText>
                      Tip: Removing pool tokens converts your position back into underlying tokens at the current rate,
                      proportional to your share of the pool. Accrued fees are included in the amounts you receive.
                    </TipText>
                  }
                  triger={
                    <span style={{ display: 'flex' }}>
                      <HelpCircle size={16} />
                    </span>
                  }
                />
              </span>
            </span>
            <Settings
              color="#D9D9D9"
              size={23}
              cursor="pointer"
              onClick={() => {
                handleConfigModalOpen(true)
              }}
            />
          </div>
          <RemoveSection data={pairDetail} onLiquidityChange={onLiquidityChange} />
          <div className="price-wrapper">
            <div className="label">Price</div>
            <div className="rate-wrapper">
              {pairDetail.rate?.map((item, index) => {
                return (
                  <div className="rate-item" key={index}>
                    1 {item.fromCurrency.symbol} = {formatUnits(item.rate, item.toCurrency.decimals)}{' '}
                    {item.toCurrency.symbol}
                  </div>
                )
              })}
            </div>
          </div>
          {account ? (
            <div className="button-wrapper">
              {}
              {(!approved || !pairDetail.pairAddress) && (
                <>
                  <ApproveBtn onClick={approve}>Approve</ApproveBtn>
                  <div className="triangle" />
                </>
              )}
              <RemoveBtn
                className={`${
                  liquidity?.isZero() ||
                  !approved ||
                  !pairDetail.pairAddress ||
                  liquidity?.gt(pairDetail.accountPairBalance)
                    ? 'disabledOther'
                    : ''
                }`}
                onClick={handleRemove}
                disabled={liquidity?.isZero() || liquidity?.gt(pairDetail.accountPairBalance || !approved)}
              >
                Remove
              </RemoveBtn>
            </div>
          ) : (
            <div className="button-wrapper">
              <RemoveBtn
                onClick={() => {
                  goConnectWallet().then()
                }}
              >
                Connect Wallet
              </RemoveBtn>
            </div>
          )}
        </div>
        <div style={{ padding: '0.3rem 0.7rem' }}>
          {pairDetail.tokens && pairDetail.tokens.length > 0 && <LPDetail data={pairDetail} />}
        </div>
      </div>
    </RemoveLPWrapper>
  )
}

const TipText = styled.span`
  display: block;
  background: #191919;
  font-size: 8px;
  width: 170px;
  font-weight: lighter;
  word-wrap: break-word;
  white-space: pre-wrap;
  padding: 3px;
  color: #9c9c9c;
`
const RemoveLPWrapper = styled.div`
  color: #d9d9d9;
  padding: 1rem;
  max-width: 480px;
  margin: 168px auto 0;
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
  .price-wrapper {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #9c9c9c;
    margin-top: 20px;
    .label {
    }
    .rate-wrapper {
      display: grid;
      row-gap: 0.5rem;
      .rate-item {
      }
    }
  }
  .button-wrapper {
    display: flex;
    justify-content: space-between;
    margin-top: 1.5rem;
    align-items: center;
    column-gap: 1.75rem;
    .triangle {
      width: 0;
      height: 0;
      border: 7px solid transparent;
      border-left: 7px solid #d9d9d9;
    }
    button {
      flex: 1;
      height: 2.8rem;
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
const ApproveBtn = styled(ConfirmBtn)``
const RemoveBtn = styled(ConfirmBtn)`
  &.disabledOther {
    background: #262626;
    color: #9c9c9c;
    cursor: not-allowed;
    pointer-events: auto;
  }
`
export default RemoveLP
