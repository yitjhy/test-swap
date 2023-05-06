import Modal from './../modal'
import React, { createContext, FC, PropsWithChildren, useContext, useState } from 'react'
import DialogContent from './dialogContent'

export enum DialogType {
  success = 'success',
  loading = 'loading',
  warn = 'warn',
}
type TDialogContext = {
  isDialogOpen: boolean
  close: () => void
  openDialog: (data: { title: string; desc: string | React.ReactNode; type: DialogType }) => void
  type: DialogType
}
const DialogContext = createContext({ isDialogOpen: false } as TDialogContext)
export function useDialog() {
  return useContext(DialogContext)
}

const DialogProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState<string | React.ReactNode>('')
  const [dialogType, setDialogType] = useState<DialogType>(DialogType.loading)
  const close = () => {
    setIsDialogOpen(false)
  }
  const openDialog: TDialogContext['openDialog'] = ({ title, desc, type }) => {
    setIsDialogOpen(true)
    setTitle(title)
    setDesc(desc)
    setDialogType(type)
  }
  return (
    <DialogContext.Provider value={{ isDialogOpen, openDialog, close, type: dialogType }}>
      <Modal
        rootStyle={{ zIndex: 9999999 }}
        maskClosable={false}
        contentStyle={{ width: 500, borderRadius: 15 }}
        title=""
        content={<DialogContent onClose={close} title={title} desc={desc} type={dialogType} />}
        open={isDialogOpen}
        onClose={close}
      />
      {children}
    </DialogContext.Provider>
  )
}
export default DialogProvider
