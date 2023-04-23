import useMobile from '@/hooks/useMobile'
import styled from 'styled-components'
import MobileHeader from '@/views/header/mobile-header'
import PCHeader from '@/views/header/pc-header'

const Header = () => {
  const isMobile = useMobile()
  return <HeaderWrapper>{isMobile ? <MobileHeader /> : <PCHeader />}</HeaderWrapper>
}
const HeaderWrapper = styled.div``
export default Header
