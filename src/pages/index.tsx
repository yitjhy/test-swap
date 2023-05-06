import useMobile from '@/hooks/useMobile'
import styled from 'styled-components'
import MobileIndex from '@/views/index/mobile-index'
import PCIndex from '@/views/index/pc-index'

const Header = () => {
  const isMobile = useMobile()
  return <HeaderWrapper>{isMobile ? <MobileIndex /> : <PCIndex />}</HeaderWrapper>
}
const HeaderWrapper = styled.div``
export default Header
