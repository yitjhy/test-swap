import styled from 'styled-components'
import { ChevronLeft, Plus } from 'react-feather'
import { Settings } from 'react-feather'
import LPDetail, { TLPDetailProps } from '@/views/add/lp-detail'
import { CancelBtn, ConfirmBtn } from '@/components/button'
import Modal from '@/components/modal'
import Config from '@/views/swap/config'
import RemoveSection, { TRemoveSection } from '@/views/remove/remove-section'
import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useLPDetail from '@/hooks/usePaireDetail'
import { formatUnits } from 'ethers/lib/utils'
import useRemoveLiquidity from '@/hooks/useRemoveLiquidity'
import { BigNumber } from 'ethers'
import { useDialog } from '@/components/dialog'
import useERC20Approved from '@/hooks/contract/useERC20Approved'
import { contractAddress } from '@/utils/enum'

const RemoveLP = () => {
  const router = useRouter()
  const { removeLiquidity, removeLiquidityETH } = useRemoveLiquidity()
  const [isConfigModalOpen, handleConfigModalOpen] = useState(false)
  const [liquidity, setLiquidity] = useState<BigNumber>()
  const [LPDetailData, setLPDetailData] = useState<TLPDetailProps>({} as any)
  const { query } = useRouter()
  const { getLPDetail } = useLPDetail()
  const { openDialog, close } = useDialog()

  const { approved, approve } = useERC20Approved(LPDetailData.pairAddress, contractAddress.router)
  console.log(approved)
  console.log(!approved && LPDetailData.pairAddress)
  useEffect(() => {
    if (query.address) {
      getLPDetail(query.address as string).then((data) => {
        console.log(data)
        setLPDetailData(data)
      })
    }
  }, [query.address, getLPDetail])

  const onLiquidityChange: TRemoveSection['onLiquidityChange'] = (data) => {
    setLiquidity(data)
  }
  const handleRemove = async () => {
    if (LPDetailData.tokens.length && !liquidity?.isZero() && approved && LPDetailData.pairAddress) {
      openDialog({ title: 'Remove', desc: 'Waiting for signing.' })
      if (LPDetailData.tokens[0].address === contractAddress.weth) {
        console.log(LPDetailData.tokens[0].address)
        console.log(liquidity)
        const operation = await removeLiquidityETH(LPDetailData.tokens[1].address, liquidity as BigNumber)
        await operation.wait()
      }
      if (LPDetailData.tokens[1].address === contractAddress.weth) {
        const operation = await removeLiquidityETH(LPDetailData.tokens[0].address, liquidity as BigNumber)
        await operation.wait()
      }
      if (
        LPDetailData.tokens[0].address !== contractAddress.weth &&
        LPDetailData.tokens[1].address !== contractAddress.weth
      ) {
        const operation = await removeLiquidity(
          LPDetailData.tokens[0].address,
          LPDetailData.tokens[1].address,
          liquidity as BigNumber
        )
        await operation.wait()
      }
      close()
    }
  }
  return (
    <RemoveLPWrapper>
      <Modal
        contentStyle={{ width: 480 }}
        title="Settings"
        content={<Config />}
        open={isConfigModalOpen}
        onClose={handleConfigModalOpen}
      />
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
        <RemoveSection data={LPDetailData} onLiquidityChange={onLiquidityChange} />
        <div className="price-wrapper">
          <div className="label">Price</div>
          <div className="rate-wrapper">
            {LPDetailData.rate?.map((item, index) => {
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
          {(!approved || !LPDetailData.pairAddress) && (
            <>
              <ApproveBtn onClick={approve}>Approve</ApproveBtn>
              <div className="triangle" />
            </>
          )}
          <RemoveBtn
            className={`${liquidity?.isZero() || !approved || !LPDetailData.pairAddress ? 'disabledOther' : ''}`}
            onClick={handleRemove}
            disabled={liquidity?.isZero()}
          >
            Remove
          </RemoveBtn>
        </div>
      </div>
      <div style={{ padding: '0.3rem 0.7rem' }}>
        {LPDetailData.tokens && LPDetailData.tokens.length > 0 && <LPDetail data={LPDetailData} />}
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
