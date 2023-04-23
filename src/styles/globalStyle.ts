import { createGlobalStyle } from 'styled-components'
export const GlobalHomeStyle = createGlobalStyle<{ isFullWindow: boolean }>`
    body {
      height: ${({ isFullWindow }) => (isFullWindow ? '100vh' : 'calc(100vh + 435px)')};
    }
`
