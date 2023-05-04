import React, { FC } from 'react'
import styled from 'styled-components'

type TTokenIconProps = {
  symbol: string
  img?: string
  style?: React.CSSProperties
  width?: number
}
const TokenIcon: FC<TTokenIconProps> = ({ symbol, img, style, width }) => {
  return (
    <TokenIconWrapper width={width} style={style ? style : {}}>
      {img ? (
        <img className="currency-icon" src={''} alt="" width={30} height={30} />
      ) : (
        <div className="logo-wrapper">{symbol?.slice(0, 3)}</div>
      )}
    </TokenIconWrapper>
  )
}
const TokenIconWrapper = styled.div<{ width?: number }>`
  --icon-width: ${({ width }) => (width ? `${width}px` : '30px')};
  font-size: 11px;
  .currency-icon {
    width: var(--icon-width);
    height: var(--icon-width);
  }
  .logo-wrapper {
    width: var(--icon-width);
    height: var(--icon-width);
    border-radius: var(--icon-width);
    background: #262626;
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
  }
`
export default TokenIcon
