import styled, { css } from 'styled-components'
import { CSSProperties } from 'react'

export default function CheckBox(props: {
  text: string
  value: boolean
  onChange: (val: boolean) => void
  style?: CSSProperties
  className?: string
  labelWidth?: string
}) {
  return (
    <CheckboxWrapper onClick={() => props.onChange(!props.value)} style={props.style} className={props.className}>
      <Check checked={props.value} />
      <span style={{ width: props.labelWidth || 'auto' }}>{props.text}</span>
    </CheckboxWrapper>
  )
}

const CheckboxWrapper = styled.span`
  font-size: 14px;
  color: #737373;
  cursor: pointer;
  display: flex;
  column-gap: 0.7rem;
  align-items: center;
`

const Check = styled.span<{ checked?: boolean }>`
  display: inline-block;
  width: 16px;
  height: 16px;
  background: #262626;
  /* margin-left: 10px; */
  position: relative;
  ${(props) =>
    props.checked
      ? css`
          &::after {
            content: '';
            width: 10px;
            height: 10px;
            background: #00ffd1;
            position: absolute;
            top: 3px;
            left: 3px;
          }
        `
      : ''}
`
