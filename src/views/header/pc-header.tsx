import styled from 'styled-components'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useWeb3React } from '@web3-react/core'
import { useWallet } from '@/context/WalletContext'
import { getEllipsisStr } from '@/utils'
import { routerMenu } from './constants'
import Dropdown, { MenuItemText, MenuItemWrapper } from '@/components/dropdown/components/dropdown'
import { LogoutOutlined } from '@ant-design/icons'
import { Chain } from '@/types/enum'

const Header = () => {
  const { account } = useWeb3React()
  const { active, deActive, switchChain } = useWallet()
  const router = useRouter()
  const [checkedMenu, setCheckedMenu] = useState(router.pathname)
  const goRouter = (route: string) => {
    setCheckedMenu(route)
    router.push(route).then()
  }
  const goConnectWallet = async () => {
    // await active('metaMask')
    await switchChain(Chain.COMBOTest)
  }
  useEffect(() => {
    setCheckedMenu(router.pathname)
  }, [router])
  return (
    <HeaderWrapper>
      <div className="nav-wrapper">
        <div
          className="website-logo-wrapper"
          onClick={() => {
            goRouter('/')
          }}
        >
          <span className="website-log">
            <Image src="/site-logo.png" alt="" width={56} height={56} />
          </span>
          <span className="website-name">
            <Image src="/site-name.svg" alt="" width={185} height={18} />
          </span>
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
          <img className="chain-logo" src="/images/header/logo_rel.svg" alt="" />
          Combo Test-Network
        </div>
        {/*<button className="connect-wallet" onClick={goConnectWallet}>*/}
        {/*  {account ? getEllipsisStr(account) : 'Connect Wallet'}*/}
        {/*</button>*/}
        <Dropdown
          menu={
            account
              ? [
                  {
                    key: 'copy',
                    label: (
                      <MenuItemWrapper
                        onClick={() => {
                          deActive().then()
                        }}
                      >
                        <MenuItemText style={{ marginRight: 26 }}>Disconnect</MenuItemText>
                        <LogoutOutlined />
                      </MenuItemWrapper>
                    ),
                  },
                ]
              : []
          }
        >
          <button className="connect-wallet" onClick={goConnectWallet}>
            {account ? getEllipsisStr(account) : 'Connect Wallet'}
          </button>
        </Dropdown>
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
  //position: relative;
  position: fixed;
  top: 0;
  z-index: 7;
  width: 100%;
  .nav-wrapper {
    display: flex;
    column-gap: 4rem;
    align-items: center;
    .website-logo-wrapper {
      display: flex;
      align-items: center;
      cursor: pointer;
      .website-log {
        margin-top: -17px;
      }
      .website-name {
        font-size: 0;
      }
    }
    .menu-wrapper {
      display: flex;
      align-items: center;
      //justify-content: space-between;
      column-gap: 5rem;
      //width: 30vw;
      .menu-item {
        cursor: pointer;
        color: #d9d9d9;
        font-size: 18px;
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
      font-size: 18px;
      .chain-logo {
        width: 28px;
        height: 28px;
        //border-radius: 50%;
        //background: #d9d9d9;
      }
    }
    .connect-wallet {
      outline: none;
      padding: 10px 28px;
      border: 1px solid #d9d9d9;
      cursor: pointer;
      background: none;
      font-size: 18px;
      color: #d9d9d9;
      border-radius: 8px;
    }
  }
`
export default Header
