import styled from 'styled-components'
import { ChevronLeft } from 'react-feather'
import { Settings } from 'react-feather'
import LPDetail from '@/views/add/lp-detail'
import { ConfirmBtn } from '@/components/button'
import Modal from '@/components/modal'
import Config from '@/views/swap/config'
import RemoveSection, { TRemoveSection } from '@/views/remove/remove-section'
import { useState } from 'react'
import { useRouter } from 'next/router'
import usePairInfo from '@/hooks/usePairInfo'
import { formatUnits } from 'ethers/lib/utils'
import useRemoveLiquidity from '@/hooks/useRemoveLiquidity'
import { BigNumber, constants } from 'ethers'
import useERC20Approved from '@/hooks/contract/useERC20Approved'
import { contractAddress } from '@/utils/enum'
import { isSameAddress } from '@/utils/address'

const RemoveLP = () => {
  const router = useRouter()
  const { removeLiquidity, removeLiquidityETH } = useRemoveLiquidity()
  const [isConfigModalOpen, handleConfigModalOpen] = useState(false)
  const [liquidity, setLiquidity] = useState<BigNumber>()
  const { query } = useRouter()
  const { pairDetail, updatePairDetail } = usePairInfo(query.address as string)

  const { approved, approve } = useERC20Approved(pairDetail.pairAddress, contractAddress.router)
  const onLiquidityChange: TRemoveSection['onLiquidityChange'] = (data) => {
    setLiquidity(data)
  }
  const handleRemove = async () => {
    if (pairDetail.tokens.length && !liquidity?.isZero() && approved && pairDetail.pairAddress) {
      if (isSameAddress(pairDetail.tokens[0].address, constants.AddressZero)) {
        await removeLiquidityETH(pairDetail.tokens[1].address, liquidity as BigNumber)
      }
      if (isSameAddress(pairDetail.tokens[1].address, constants.AddressZero)) {
        await removeLiquidityETH(pairDetail.tokens[0].address, liquidity as BigNumber)
      }
      if (
        !isSameAddress(pairDetail.tokens[0].address, constants.AddressZero) &&
        !isSameAddress(pairDetail.tokens[1].address, constants.AddressZero)
      ) {
        await removeLiquidity(pairDetail.tokens[0].address, pairDetail.tokens[1].address, liquidity as BigNumber)
      }
      updatePairDetail()
    }
  }
  return (
    <RemoveLPWrapper>
      {/*<Modal*/}
      {/*  contentStyle={{ width: 480 }}*/}
      {/*  title="Settings"*/}
      {/*  content={<Config />}*/}
      {/*  open={isConfigModalOpen}*/}
      {/*  onClose={handleConfigModalOpen}*/}
      {/*/>*/}
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
          <span>Remove</span>
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
                  1{item.fromCurrency.symbol}={formatUnits(item.rate, item.toCurrency.decimals)}
                  {item.toCurrency.symbol}
                </div>
              )
            })}
          </div>
        </div>
        <div className="button-wrapper">
          {(!approved || !pairDetail.pairAddress) && (
            <>
              <ApproveBtn onClick={approve}>Approve</ApproveBtn>
              <div className="triangle" />
            </>
          )}
          <RemoveBtn
            className={`${liquidity?.isZero() || !approved || !pairDetail.pairAddress ? 'disabledOther' : ''}`}
            onClick={handleRemove}
            disabled={liquidity?.isZero()}
          >
            Remove
          </RemoveBtn>
        </div>
      </div>
      <div style={{ padding: '0.3rem 0.7rem' }}>
        {pairDetail.tokens && pairDetail.tokens.length > 0 && <LPDetail data={pairDetail} />}
      </div>
    </RemoveLPWrapper>
  )
}

const RemoveLPWrapper = styled.div`
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
