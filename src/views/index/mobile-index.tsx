import styled from 'styled-components'
import MobileView1 from './mobile-view1'
import MobileView2 from './mobile-view2'
import MobileView3 from './mobile-view3'
import { useState } from 'react'

const viewBgObj: Record<'view1' | 'view2' | 'view3', string> = {
  view1: '/images/home/view1.png',
  view2: '/images/home/view2.png',
  view3: '/images/home/view3.png',
}
const MobileIndex = () => {
  const [checkedView, setCheckedView] = useState<'view1' | 'view2' | 'view3'>('view1')
  const onNext = (id: 'view1' | 'view2' | 'view3') => {
    setCheckedView(id)
  }
  const onPre = (id: 'view1' | 'view2' | 'view3') => {
    setCheckedView(id)
  }
  return (
    <MobileIndexWrapper bg={viewBgObj[checkedView]}>
      {checkedView === 'view1' && <MobileView1 onNext={onNext} />}
      {checkedView === 'view2' && <MobileView2 onNext={onNext} onPre={onPre} />}
      {checkedView === 'view3' && <MobileView3 onPre={onPre} />}
    </MobileIndexWrapper>
  )
}
const MobileIndexWrapper = styled.div<{ bg: string }>`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  background: ${({ bg }) => `url('${bg}')`};
  background-size: cover;
`
export default MobileIndex
