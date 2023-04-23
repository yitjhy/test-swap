import styled from 'styled-components'
import { useWallet } from '@/context/WalletContext'
import { useWeb3React } from '@web3-react/core'
import { routerMenu } from './constants'
import { useRouter } from 'next/router'
import { useState, useRef } from 'react'
import { useClickAway } from 'ahooks'

const MobileHeader = () => {
  const { isActive } = useWeb3React()
  const { active } = useWallet()
  const router = useRouter()
  const menuWrapperRef = useRef<HTMLDivElement>(null)
  const [checkedMenu, setCheckedMenu] = useState(router.pathname)
  const [isShowMenu, setIsShowMenu] = useState(false)
  const goConnectWallet = async () => {
    await active('metaMask')
  }
  const goRouter = (route: string) => {
    setCheckedMenu(route)
    router.push(route).then()
  }
  useClickAway(() => {
    setIsShowMenu(false)
  }, menuWrapperRef)
  return (
    <MobileHeaderWrapper>
      <div className="menu-wrapper" ref={menuWrapperRef}>
        <img
          src="/images/header/menu_white.svg"
          alt=""
          className="menu-icon"
          onClick={() => {
            setIsShowMenu(!isShowMenu)
          }}
        />
        <div
          className="menu-wrapper-box"
          style={{ height: isShowMenu ? 80 : 0, padding: !isShowMenu ? 0 : '16px 38px 16px 17px' }}
        >
          {routerMenu.map((item) => {
            return (
              <div
                style={{ color: checkedMenu === item.route ? '#BFFF37' : '#FFFFFF' }}
                className="menu-item-wrapper"
                key={item.key}
                onClick={() => {
                  setIsShowMenu(false)
                  goRouter(item.route)
                }}
              >
                {item.name}
              </div>
            )
          })}
        </div>
      </div>
      <div className="menu-wrapper">
        <img
          src="/images/header/hunterswap.svg"
          alt=""
          className="site-icon"
          onClick={() => {
            goRouter('/')
          }}
        />
      </div>
      <div className="menu-wrapper">
        {isActive ? (
          <img src="/images/header/logout_yellow.svg" alt="" className="logout-icon" />
        ) : (
          <img src="/images/header/logoout.svg" alt="" className="logout-icon" onClick={goConnectWallet} />
        )}
      </div>
    </MobileHeaderWrapper>
  )
}
const MobileHeaderWrapper = styled.div`
  display: flex;
  width: 90vw;
  margin: 20px 5vw 0;
  justify-content: space-between;
  align-items: center;
  color: #fcfcfc;
  position: fixed;
  top: 0;
  z-index: 7;
  .menu-wrapper {
    position: relative;
    .menu-wrapper-box {
      display: grid;
      background: linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 100%);
      padding: 16px 38px 16px 17px;
      color: #fff;
      row-gap: 11px;
      position: absolute;
      top: calc(100% + 10px);
      z-index: 100;
      transition: all linear 0.12s;
      overflow: hidden;
      .menu-item-wrapper {
        font-size: 16px;
      }
    }
  }
  .menu-icon {
    width: 22px;
    height: 17px;
  }
  .site-icon {
    width: 137px;
    height: 13px;
  }
  .logout-icon {
    width: 23px;
    height: 23px;
  }
`
export default MobileHeader
