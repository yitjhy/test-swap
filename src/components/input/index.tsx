import styled from 'styled-components';
export const NumberInput = styled.input.attrs({ type: 'number' })`
  transition: opacity 0.2s ease-in-out;
  text-align: left;
  font-size: 16px;
  flex: 1 1 auto;
  overflow: hidden;
  border: 1px solid rgb(210, 217, 238);
  background: rgb(245, 246, 252);
  text-indent: 1rem;
  border-radius: 12px;
  outline: none;
  padding: 0;
  margin: 0;
  &:focus {
    border: 1px solid rgb(210, 217, 238);
    background: rgb(245, 246, 252);
    outline: none;
  }
`;
export const TextInput = styled.input.attrs({ type: 'text' })`
  transition: opacity 0.2s ease-in-out;
  text-align: left;
  font-size: 16px;
  flex: 1 1 auto;
  overflow: hidden;
  border: 1px solid rgb(210, 217, 238);
  background: rgb(245, 246, 252);
  text-indent: 1rem;
  border-radius: 12px;
  outline: none;
  padding: 0;
  margin: 0;
  &:focus {
    border: 1px solid rgb(210, 217, 238);
    background: rgb(245, 246, 252);
    outline: none;
  }
  &::placeholder {
    font-size: 14px;
  }
`;
