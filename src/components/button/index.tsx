import styled from 'styled-components'

const BaseBtn = styled.button`
  border: none;
  outline: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 3rem;
  font-size: 16px;
`

export const CancelBtn = styled(BaseBtn)`
  background: #262626;
  color: #9c9c9c;
`

export const ConfirmBtn = styled(BaseBtn)`
  background: #bfff37;
  color: #120d00;
`
