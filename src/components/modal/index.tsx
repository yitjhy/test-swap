import styled from 'styled-components'
import { X } from 'react-feather'
import { FC, ReactNode, useEffect, useState, MouseEvent, CSSProperties } from 'react'
export type TModalProps = {
  open: boolean
  title: ReactNode
  content: ReactNode
  onClose: (open: boolean) => void
  contentStyle?: CSSProperties
  maskClosable?: boolean
}
const Modal: FC<TModalProps> = ({ title, content, maskClosable = true, open, onClose, contentStyle }) => {
  const [isOpen, setIsOpen] = useState(open)
  useEffect(() => {
    setIsOpen(open)
  }, [open])
  const handleClose = () => {
    setIsOpen(false)
    onClose(false)
  }
  const stopPropagation = (e: MouseEvent) => {
    e.stopPropagation()
  }
  return (
    <ModalWrapper
      open={isOpen}
      onClick={() => {
        if (!!maskClosable) {
          handleClose()
        }
      }}
    >
      <div className="modal-content-wrapper" onClick={stopPropagation} style={contentStyle}>
        <div className="modal-header">
          <span className="modal-header-title">{title}</span>
          <X color="#9C9C9C" cursor="pointer" onClick={handleClose} />
        </div>
        <>{content}</>
      </div>
    </ModalWrapper>
  )
}
const ModalWrapper = styled.div<{ open: boolean }>`
  visibility: ${({ open }) => (open ? 'visible' : 'hidden')};
  opacity: ${({ open }) => (open ? 1 : 0)};
  position: fixed;
  background: rgba(0, 0, 0, 0.92);
  transition: all linear 0.15s;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 1000000;
  left: 0;
  top: 0;
  .modal-content-wrapper {
    display: grid;
    grid-auto-rows: auto;
    row-gap: 25px;
    z-index: 2;
    background: #1a1a1a;
    padding: 20px;
    /* border-radius: 12px; */
    margin-top: 20vh;
    color: #d9d9d9;
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .modal-header-title {
        font-size: 20px;
      }
      .modal-close-icon {
      }
    }
  }
`
export default Modal
