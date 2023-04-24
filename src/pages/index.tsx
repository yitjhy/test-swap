import useMobile from '@/hooks/useMobile'
import styled from 'styled-components'
import MobileIndex from '@/views/index/mobile-index'
import PCIndex from '@/views/index/pc-index'
import { GlobalHomeStyle } from '@/styles/globalStyle'
import { useEffect, useState } from 'react'

const Header = () => {
  const [isFullWindow, setIsFullWindow] = useState(false)
  const isMobile = useMobile()
  useEffect(() => {
    return () => {
      setIsFullWindow(true)
    }
  }, [])
  return (
    <HeaderWrapper>
      <GlobalHomeStyle isFullWindow={isFullWindow || isMobile} />
      {isMobile ? <MobileIndex /> : <PCIndex />}
    </HeaderWrapper>
  )
}
const HeaderWrapper = styled.div``
export default Header
