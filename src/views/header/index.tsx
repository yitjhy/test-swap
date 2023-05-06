import useMobile from '@/hooks/useMobile'
import styled from 'styled-components'
import MobileHeader from '@/views/header/mobile-header'
import PCHeader from '@/views/header/pc-header'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { GlobalHomeStyle } from '@/styles/globalStyle'

const Header = () => {
  const isMobile = useMobile()
  const router = useRouter()
  const [isFullWindow, setIsFullWindow] = useState(false)
  useEffect(() => {
    if (router.pathname === '/') {
      setIsFullWindow(false)
    } else {
      setIsFullWindow(true)
    }
  }, [router])
  return (
    <HeaderWrapper>
      <GlobalHomeStyle isFullWindow={isFullWindow || isMobile} />
      {isMobile ? <MobileHeader /> : <PCHeader />}
    </HeaderWrapper>
  )
}
const HeaderWrapper = styled.div``
export default Header
