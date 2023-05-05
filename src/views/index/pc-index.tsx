import Head from 'next/head'
import styled from 'styled-components'
import { useScroll } from 'ahooks'
import { useEffect, useState } from 'react'
import { CaretRightOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import { GlobalHomeStyle } from '@/styles/globalStyle'

export default function Home() {
  const router = useRouter()
  const [statisticsOpacity, setStatisticsOpacity] = useState(1)
  const [opacity2, setOpacity2] = useState(0)
  const [opacity3, setOpacity3] = useState(0)
  const [bgSize, setBgSize] = useState(100)
  const [bgPosition, setBgPosition] = useState<{ left: number; top: number }>({ left: 0, top: 0 })
  const scroll = useScroll(() => document)
  useEffect(() => {
    if (scroll && scroll.top) {
      if (scroll.top < 50) {
        setStatisticsOpacity(1)
        setOpacity2(0)
        setOpacity3(0)
        setBgSize(100)
      }
      if (scroll.top < 210 && scroll.top > 50) {
        // 切换到第二屏
        // const newSize = 100 + scroll.top / 3
        // setBgSize(newSize)
        setBgSize(170)
        // setStatisticsOpacity(1 - scroll.top / 210)
        setStatisticsOpacity(0)
        // setOpacity2(scroll.top / 210)
        setOpacity2(1)
        setOpacity3(0)
        setBgPosition({
          left: 0,
          top: 0,
        })
      }
      if (scroll.top >= 300 && scroll.top < 435) {
        // const leftPosition = (scroll.top - 210) / 3
        // const topPosition = (scroll.top - 210) / 7
        // setBgPosition({
        //   left: leftPosition,
        //   top: topPosition,
        // })
        // setStatisticsOpacity(0)
        // setOpacity3((scroll.top - 210) / 225)
        // setOpacity2(1 - (scroll.top - 210) / 225)
        setBgPosition({
          left: (435 - 210) / 3,
          top: (435 - 210) / 7,
        })
        setStatisticsOpacity(0)
        setOpacity3((435 - 210) / 225)
        setOpacity2(0)
      }
      if (scroll.top === 435) {
        // setStatisticsOpacity(0)
        // setOpacity2(0)
        // setOpacity3(1)
      }
    }
  }, [scroll])
  return (
    <div>
      <Head>
        <title>HUNTERSWAP</title>
        <meta name="description" content="HUNTERSWAP" />
        {/*<meta name="viewport" content="width=device-width, initial-scale=1" />*/}
        {/*<link rel="icon" href="/favicon.ico" />*/}
      </Head>
      <MainWrapper bgSize={bgSize} bgPosition={bgPosition}>
        <div
          className="statisticsWrapper"
          style={{ opacity: statisticsOpacity, transform: `translateX(-50%) scale(${statisticsOpacity})` }}
        >
          <span className="title">HUNTERSWAP</span>
          <span className="des">The hunterswap on First-ever Game OPTIMISTIC Rollup on BSC CHAIN</span>
          <span className="des2">
            As BSC's first ever zkRollup, Thehuterswap allows you to avoid costly gas fees and network congestion with
            the same security as mainnet - 100x cheaper and faster.
          </span>
          <div className="statisticsContent">
            <div className="statisticsItemWrapper">
              <div className="count">-</div>
              <div className="label">All Time Volume</div>
            </div>
            <div className="statisticsItemWrapper">
              <div className="count">-</div>
              <div className="label">Number of users</div>
            </div>
            <div className="statisticsItemWrapper">
              <div className="count">-</div>
              <div className="label">All Time Trades</div>
            </div>
            <div className="statisticsItemWrapper">
              <div className="count">-</div>
              <div className="label">Project Partner</div>
            </div>
          </div>
        </div>
        <div
          className="introduceWrapper"
          style={{ opacity: opacity2, transform: `translateX(-50%) scale(${opacity2})` }}
        >
          <span className="title">Millisecond Speed</span>
          <span className="desc">
            The TPS can be increased by multiple orders of magnitude. While users enjoy a smooth transaction experience
          </span>
          <div
            className="swap"
            onClick={() => {
              router.push('/swap').then()
            }}
          >
            SWAP <CaretRightOutlined style={{ fontSize: 10, marginLeft: 15 }} />
          </div>
        </div>
        <div className="content" style={{ opacity: opacity3, transform: `scale(${opacity3})` }}>
          {/*<div>{JSON.stringify(scroll)}</div>*/}
          <div className="title">Ecological Partner</div>
          <div className="introduce">
            Collect the application partners of BNB Chain to form an entire ecosystemBuild scalable payment apps,
            non-custodial exchanges, and NFT marketpl-aces on Ethereum with Loopring's time-tested zkRollup technology.
            Get started with quick-start guides, protocol documentation, a Javascript SDK, and a fully open source
            codebase.
          </div>
          <div className="menuWrapper">
            <div className="itemWrapper">
              <div className="item">
                <img src="/images/home/nodereal.svg" alt="" width={315} height={48} />
              </div>
              <div className="item">
                <img src="/images/home/unco.svg" alt="" width={150} height={67} />
              </div>
              {/*<div className="blockChain">*/}
              {/*  <div className="blockChainItem">COCOS</div>*/}
              {/*  <div className="blockChainItem">BLOCKCHAIN</div>*/}
              {/*  <div className="blockChainItem">EXPEDITION</div>*/}
              {/*</div>*/}
            </div>
            <div className="itemWrapper">
              <div className="item">
                <img src="/images/home/bnbchain.svg" alt="" width={271} height={54} />
              </div>
              <div className="item">
                <img src="/images/home/optmism.svg" alt="" width={211} height={28} />
              </div>
            </div>
          </div>
        </div>
        <div className="copyRight">©2023 Huterswap . All Rights Reserved</div>
      </MainWrapper>
    </div>
  )
}

const MainWrapper = styled.div<{ bgSize: number; bgPosition: { left: number; top: number } }>`
  background: url('/images/home/home-bg2.png');
  background-size: ${({ bgSize }) => `${bgSize}%`};
  background-repeat: no-repeat;
  background-position: ${({ bgPosition }) => `left ${bgPosition.left}% top ${bgPosition.top}%`};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 6rem;
  min-height: 100vh;
  position: fixed;
  width: 100vw;
  z-index: 6;
  top: 0;
  left: 0;
  transition: all linear 0.25s;
  .statisticsWrapper {
    color: #ffffff;
    //margin-top: 200px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 270px;
    width: 70vw;
    .title {
      font-size: 90px;
      line-height: 116px;
      display: block;
      text-align: center;
    }
    .des {
      font-size: 20px;
      line-height: 25px;
      display: block;
      text-align: center;
    }
    .des2 {
      display: block;
      text-align: center;
      font-size: 14px;
      line-height: 19px;
    }
    .statisticsContent {
      display: flex;
      color: #ffffff;
      justify-content: space-between;
      margin-top: 170px;
      .statisticsItemWrapper {
        .count {
          font-size: 58px;
          line-height: 69px;
          text-align: center;
        }
        .label {
          font-size: 18px;
          line-height: 23px;
          text-align: center;
        }
      }
    }
  }
  .content {
    position: absolute;
    margin-top: 140px;
    width: 738px;
    right: 7vw;
    .title {
      font-size: 78px;
      color: #ffffff;
    }
    .introduce {
      font-size: 14px;
      color: #ffffff;
      margin-top: 20px;
      line-height: 184.27%;
    }
    .menuWrapper {
      margin-top: 66px;
      font-size: 28px;
      display: grid;
      row-gap: 40px;
      .itemWrapper {
        display: flex;
        column-gap: 67px;
        align-items: center;
        .item {
        }
        .blockChain {
          /*width: 200px;*/
          .blockChainItem {
            font-size: 12px;
          }
        }
      }
    }
  }
  .introduceWrapper {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 270px;
    width: 725px;
    color: #ffffff;
    transition: all linear 0.25s;
    .title {
      font-size: 78px;
      line-height: 93px;
      display: block;
      text-align: center;
    }
    .desc {
      font-size: 20px;
      line-height: 25px;
      display: block;
      width: 660px;
      margin-top: 10px;
    }
    .swap {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 165px;
      margin-top: 34px;
      border: 1px solid #ffffff;
      padding: 8px 22px;
      font-size: 25px;
      cursor: pointer;
    }
  }
  .copyRight {
    position: fixed;
    text-align: center;
    font-size: 12px;
    color: #a6a6a6;
    bottom: 20px;
  }
`
