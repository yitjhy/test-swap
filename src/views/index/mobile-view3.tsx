import styled from 'styled-components'
import { FC } from 'react'
import { CaretUpOutlined } from '@ant-design/icons'

const MobileView3: FC<{ onPre: (id: 'view1' | 'view2' | 'view3') => void }> = ({ onPre }) => {
  const handlePre = () => {
    onPre('view2')
  }
  return (
    <MobileView3Wrapper>
      <span className="title">Ecosystem Partner</span>
      <span className="des">
        At HunterSwap, we have established partnerships with various collaborators across business, technology, and
        funding to cultivate an ecological economy and bolster the growth of the ecosystem.
      </span>
      {/*<div className="menuWrapper">*/}
      {/*  <div className="itemWrapper">*/}
      {/*    <div className="item">*/}
      {/*      <img src="/images/home/nodereal.svg" alt="" width={226} height={35} />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div className="itemWrapper">*/}
      {/*    <div className="item">*/}
      {/*      <img src="/images/home/bnbchain.svg" alt="" width={194} height={39} />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div className="itemWrapper">*/}
      {/*    <div className="item">*/}
      {/*      <img src="/images/home/unco.svg" alt="" width={107} height={48} />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div className="itemWrapper">*/}
      {/*    <div className="item">*/}
      {/*      <img src="/images/home/optmism.svg" alt="" width={151} height={20} />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
      <div className="pre-btn">
        <CaretUpOutlined onClick={handlePre} />
      </div>
    </MobileView3Wrapper>
  )
}
const MobileView3Wrapper = styled.div`
  padding: 0 21px;
  width: 100%;
  .title {
    font-size: 24px;
    color: #ffffff;
    text-align: center;
    display: block;
  }
  .des {
    font-size: 12px;
    color: #ffffff;
    text-align: left;
    display: block;
    margin-top: 17px;
  }
  .menuWrapper {
    margin-top: 60px;
    font-size: 28px;
    display: grid;
    row-gap: 30px;
    .itemWrapper {
      display: flex;
      column-gap: 67px;
      align-items: center;
      justify-content: center;
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
  .pre-btn {
    position: fixed;
    bottom: 75px;
    color: #fff;
    font-size: 30px;
    right: 30px;
  }
`
export default MobileView3
