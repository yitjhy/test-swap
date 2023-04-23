import { createGlobalStyle } from 'styled-components'
export const GlobalHomeStyle = createGlobalStyle<{ isFullWindow: boolean }>`
    body {
      height: ${({ isFullWindow }) => (isFullWindow ? '100vh !important' : 'calc(100vh + 435px) !important')};
    }
`
