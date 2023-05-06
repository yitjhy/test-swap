import styled from 'styled-components'
import Image from 'next/image'
import { FC } from 'react'
import { Copy, Link } from 'react-feather'
import { ConfirmBtn, CancelBtn } from '@/components/button'
import copy from 'copy-to-clipboard'

type TNotTradedWaning = {
  address: string
  symbol: string
  onCancel: () => void
  onConfirm: () => void
}
const NotTradedWaning: FC<TNotTradedWaning> = ({ onConfirm, onCancel, address, symbol }) => {
  const handleConfirm = () => {
    onConfirm()
  }
  const handleCancel = () => {
    onCancel()
  }
  const url = `https://combotrace-testnet.nodereal.io/address/${address}`
  const viewScanAddress = () => {
    window.open(url, '__blank')
  }
  return (
    <NotTradedWaningWrapper>
      <div className="not-traded-waning-icon">
        {/*<Image className="currency-icon" src="/waning-modal-icon.png" alt="" width={40} height={40} />*/}
        <div className="logo-wrapper">{symbol?.slice(0, 3)}</div>
      </div>
      <span className="waning-title">
        Wrapped Ether{' '}
        <span className="image-wrapper">
          <Image src="/warning.png" alt="" width={15} height={15} />
        </span>
      </span>
      <span className="description-text">The token is not included and is not traded on Hunterswap</span>
      <div className="help-wrapper">
        <div className="currncy-url">{url}</div>
        <Link color="#9C9C9C" size={16} cursor="pointer" onClick={viewScanAddress} />
        <Copy
          color="#9C9C9C"
          size={16}
          cursor="pointer"
          onClick={() => {
            copy(address)
          }}
        />
      </div>
      <ConfirmBtn onClick={handleConfirm}>I Know</ConfirmBtn>
      <CancelBtn style={{ background: '#1A1A1A' }} onClick={onCancel}>
        Cancel
      </CancelBtn>
    </NotTradedWaningWrapper>
  )
}
const NotTradedWaningWrapper = styled.div`
  display: grid;
  row-gap: 1.8rem;
  font-size: 16px;
  line-height: 19px;
  color: #d9d9d9;
  .logo-wrapper {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #f2f4f7;
    color: #131313;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
  }
  .not-traded-waning-icon {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .waning-title {
    text-align: center;
    position: relative;
    .image-wrapper {
      /* position: absolute;
      right: 0;
      top: 0; */
      transform: translateY(-100%);
    }
  }
  .description-text {
    width: 82%;
    margin: 0 auto;
  }
  .help-wrapper {
    color: #d9d9d9;
    background: #262626;
    height: 2.2rem;
    padding: 13px 11px;
    display: flex;
    align-items: center;
    column-gap: 0.7rem;
    .currncy-url {
      flex: 1;
      font-size: 12px;
      width: 100px;
      overflow: hidden;
    }
  }
`
export default NotTradedWaning
