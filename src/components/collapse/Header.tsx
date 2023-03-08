import styled from 'styled-components'
import React, { useState, memo, FC } from 'react'

interface HeaderProps {
  title: React.ReactNode
  showOperation: boolean
  onClick?: Function
  className?: string
  operation?: React.ReactNode | string
}

const DefaultOperation: FC<{ isExpand: boolean }> = ({ isExpand }) => (
  <HeaderArrowIcon isExpand={isExpand}>&#9650;</HeaderArrowIcon>
)

const Header: FC<HeaderProps> = ({ title, onClick, showOperation = true, className, operation }) => {
  const [isExpand, setIsExpand] = useState<boolean>(false)
  const handleClickHeader = () => {
    setIsExpand(!isExpand)
    onClick && onClick()
  }
  return (
    <>
      <HeaderWrapper onClick={handleClickHeader} showOperation={showOperation} className={className}>
        <HeaderTitle>{title || 'others'}</HeaderTitle>
        {showOperation && (operation || <DefaultOperation isExpand={isExpand} />)}
      </HeaderWrapper>
    </>
  )
}

const HeaderWrapper = styled.div<{ showOperation: boolean }>`
  //width: 100%;
  background: #262626;
  padding: 11px 19px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #d9d9d9;
  font-size: 16px;
  cursor: ${({ showOperation }) => (showOperation ? 'pointer' : 'normal')};
`

const HeaderTitle = styled.span`
  font-weight: 400;
  font-size: 16px;
`

const HeaderArrowIcon = styled.div<{ isExpand: boolean }>`
  transition: all cubic-bezier(0.39, 0.58, 0.57, 1) 0.2s;
  user-select: none;
  transform: ${({ isExpand }) => (isExpand ? 'rotate(180deg)' : 'rotate(0deg)')};
`

export default memo(Header)
