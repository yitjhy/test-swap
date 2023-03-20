import styled from 'styled-components'
import Image from 'next/image'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useWeb3React } from '@web3-react/core'
import { useWallet } from '@/context/WalletContext'
import { getEllipsisStr } from '@/utils'

const routerMenu = [
  { name: 'Swap', route: '/swap', key: 'swap' },
  { name: 'Liquidity', route: '/lp', key: 'Liquidity' },
  { name: 'Bridge', route: '/bridge', key: 'Bridge' },
  { name: 'Docs', route: '/docs', key: 'Docs' },
]
const Header = () => {
  const { account } = useWeb3React()
  const { active } = useWallet()
  const router = useRouter()
  const [checkedMenu, setCheckedMenu] = useState(router.pathname)
  const goRouter = (route: string) => {
    setCheckedMenu(route)
    router.push(route).then()
  }
  const goConnectWallet = async () => {
    await active('metaMask')
  }
  return (
    <HeaderWrapper>
      <div className="nav-wrapper">
        <div className="website-logo-wrapper" onClick={() => router.push('/')}>
          <span className="website-log">
            <Image src="/site-logo.png" alt="" width={48} height={48} />
          </span>
          <span className="website-name">HUNTERSWAP</span>
        </div>
        <div className="menu-wrapper">
          {routerMenu.map((item) => {
            return (
              <div
                style={{ color: checkedMenu === item.route ? '#BFFF37' : '#FFFFFF' }}
                className="menu-item"
                key={item.key}
                onClick={() => {
                  goRouter(item.route)
                }}
              >
                {item.name}
              </div>
            )
          })}
        </div>
      </div>
      <div className="operation-wrapper">
        <div className="chain-wrapper">
          <div className="chain-logo" />
          Cocos Smart Chain
        </div>
        <button className="connect-wallet" onClick={goConnectWallet}>
          {account ? getEllipsisStr(account) : 'Connect Wallet'}
        </button>
      </div>
    </HeaderWrapper>
  )
}
const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 37px 5vw 0 49px;
  font-size: 20px;
  color: #d9d9d9;
  .nav-wrapper {
    display: flex;
    column-gap: 7rem;
    align-items: center;
    .website-logo-wrapper {
      display: flex;
      column-gap: 1rem;
      align-items: center;
      cursor: pointer;
      .website-log {
      }
      .website-name {
      }
    }
    .menu-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 30vw;
      .menu-item {
        cursor: pointer;
        color: #d9d9d9;
      }
    }
  }
  .operation-wrapper {
    display: flex;
    column-gap: 4.3rem;
    .chain-wrapper {
      display: flex;
      align-items: center;
      column-gap: 0.75rem;
      .chain-logo {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: #d9d9d9;
      }
    }
    .connect-wallet {
      outline: none;
      padding: 13px 34px;
      border: 1px solid #d9d9d9;
      cursor: pointer;
      background: none;
      font-size: 20px;
      color: #d9d9d9;
    }
  }
`
export default Header
