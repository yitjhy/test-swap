import Modal from './../modal'
import { createContext, FC, PropsWithChildren, useContext, useState } from 'react'
import styled from 'styled-components'
import { LoadingOutlined } from '@ant-design/icons'

type TDialogContext = {
  // remoteCurrencyList: TRemoteCurrencyListItem[]
  // currencyList: TErc20InfoItem[]
  isDialogOpen: boolean
  close: () => void
  openDialog: (data: { title: string; desc: string }) => void
}

const DialogContext = createContext({} as TDialogContext)

export function useDialog() {
  return useContext(DialogContext)
}

const DialogContent: FC<{ title: string; desc: string }> = ({ title, desc }) => {
  return (
    <DialogContentWrapper>
      <div className="title">{title}</div>
      <div className="desc">{desc}</div>
      <div className="loading-wrapper">
        <LoadingOutlined />
      </div>
    </DialogContentWrapper>
  )
}
const DialogContentWrapper = styled.div`
  display: grid;
  row-gap: 15px;
  padding-bottom: 32px;
  .title {
    display: flex;
    justify-content: center;
    font-size: 26px;
    color: #d9d9d9;
  }
  .desc {
    display: flex;
    justify-content: center;
    font-size: 16px;
    color: #9c9c9c;
  }
  .loading-wrapper {
    display: flex;
    justify-content: center;
    font-size: 23px;
    color: #9c9c9c;
  }
`
const DialogProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const close = () => {
    setIsDialogOpen(false)
  }
  const openDialog: TDialogContext['openDialog'] = ({ title, desc }) => {
    setIsDialogOpen(true)
    setTitle(title)
    setDesc(desc)
  }
  return (
    <DialogContext.Provider value={{ isDialogOpen, openDialog, close }}>
      <Modal
        maskClosable={false}
        contentStyle={{ width: 480 }}
        title=""
        content={<DialogContent title={title} desc={desc} />}
        open={isDialogOpen}
        onClose={close}
      />
      {children}
    </DialogContext.Provider>
  )
}
export default DialogProvider
