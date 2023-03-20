import { FC, ReactNode, CSSProperties } from 'react'
import styled from 'styled-components'

const SubmitBtn: FC<{ text: ReactNode; onSubmit: () => void; disabled?: boolean; style?: CSSProperties }> = ({
  text,
  onSubmit,
  disabled,
  style,
}) => {
  const handleSubmit = () => {
    onSubmit()
  }
  return (
    <SubmitBtnWrapper onClick={handleSubmit} disabled={disabled} style={style} className={disabled ? 'invalid' : ''}>
      {text}
      <div className="triangle-left" />
      <div className="triangle-right" />
    </SubmitBtnWrapper>
  )
}
const SubmitBtnWrapper = styled.button`
  width: 100%;
  border: none;
  outline: none;
  background-color: #bfff37;
  color: #120d00;
  box-shadow: none;
  font-size: 20px;
  font-weight: 600;
  padding: 16px;
  text-align: center;
  /* border-radius: 20px; */
  margin-top: 21px;
  margin-bottom: 7px;
  cursor: pointer;
  position: relative;
  user-select: none;
  &.invalid {
    background-color: #262626;
    cursor: no-drop;~
    pointer-events: auto;
    color: #9c9c9c;
  }
  .triangle-left {
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-bottom: 10px solid #191919;
    position: absolute;
    bottom: 0;
    left: 0;
    transform: translateX(-50%);
  }
  .triangle-right {
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-bottom: 10px solid #191919;
    position: absolute;
    bottom: 0;
    right: 0;
    transform: translateX(50%);
  }
`
export default SubmitBtn
