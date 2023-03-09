import React, { PropsWithChildren } from 'react'
import Header from '@/views/header'

const Layout: React.FC<PropsWithChildren<{}>> = (props) => {
  return (
    <div>
      <Header />
      {props.children}
    </div>
  )
}
export default Layout
