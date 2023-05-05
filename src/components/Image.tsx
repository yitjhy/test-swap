import { forwardRef, ImgHTMLAttributes } from 'react'
import styled from 'styled-components'

export const Image = forwardRef<HTMLImageElement, ImgHTMLAttributes<HTMLImageElement>>((props, ref) => (
  <_Image alt={''} {...props} ref={ref} />
))

const _Image = styled.img``
