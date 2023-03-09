import styled from 'styled-components'
import { ChevronLeft, Plus } from 'react-feather'
import { Settings } from 'react-feather'
import LPShare from '@/views/add/lp-share'
import { CancelBtn, ConfirmBtn } from '@/components/button'
import Modal from '@/components/modal'
import Config from '@/views/swap/config'
import RemoveSection from '@/views/remove/remove-section'
import { useState } from 'react'

const RemoveLP = () => {
  const [isConfigModalOpen, handleConfigModalOpen] = useState(false)
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
          <span className="back-btn">
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
        <RemoveSection />
        <div className="price-wrapper">
          <div className="label">Price</div>
          <div className="rate-wrapper">
            <div className="rate-item">1USDT=0.000147ETH</div>
            <div className="rate-item">1ETH=2642USDT</div>
          </div>
        </div>
        <div className="button-wrapper">
          <ApproveBtn>Approve</ApproveBtn>
          <div className="triangle" />
          <RemoveBtn>Remove</RemoveBtn>
        </div>
      </div>
      <div style={{ padding: '0.3rem 0.7rem' }}>
        <LPShare />
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
const ApproveBtn = styled(CancelBtn)``
const RemoveBtn = styled(ConfirmBtn)``
export default RemoveLP
