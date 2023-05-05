import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { NoOperation } from '@/utils'
import { Image } from '@/components/Image'

interface MessageParams {
  success: (text: string | React.ReactNode, duration?: number) => void
  error: (text: string | React.ReactNode, duration?: number) => void
}

const MessageContext = createContext<MessageParams>({
  success: NoOperation,
  error: NoOperation,
})

enum MessageType {
  Error,
  Success,
}

interface MessageItem {
  id: number
  text: string | React.ReactNode
  type: MessageType
  timer: number
}

const DEFAULT_DURATION = 3500

let num = 0

const MAX = 5

export default function MessageProvider(props: { children?: any }) {
  const [messages, setMessages] = useState<MessageItem[]>([])

  const sendFunc = useCallback((type: MessageType) => {
    return function (text: string | React.ReactNode, duration?: number) {
      const id = num++
      const timer = window.setTimeout(() => {
        setMessages((prev) => {
          return prev.filter((x) => x.id !== id)
        })
      }, duration || DEFAULT_DURATION)
      setMessages((prev) => {
        prev.slice(MAX - 1).forEach((m) => window.clearTimeout(m.timer))
        return [{ text, type, id, timer }, ...prev].slice(0, MAX)
      })
    }
  }, [])

  const success = useCallback(sendFunc(MessageType.Success), [])
  const error = useCallback(sendFunc(MessageType.Error), [])
  return (
    <MessageContext.Provider value={{ success, error }}>
      {props.children}
      <MessageContent messages={messages} />
    </MessageContext.Provider>
  )
}

const iconMap: {
  [key in MessageType]: string
} = {
  [MessageType.Error]: '/images/common/error_white_message.svg',
  [MessageType.Success]: '/images/common/success_white_message.svg',
}

function MessageContent(props: { messages: MessageItem[] }) {
  const ref = useRef<HTMLDivElement>()
  useEffect(() => {
    const dom = (ref.current = ref.current || document.createElement('div'))
    if (dom) {
      document.body.appendChild(dom)
      return () => {
        document.body.removeChild(dom)
      }
    }
  }, [])

  return ref.current
    ? createPortal(
        <MessageWrappers>
          <TransitionGroup>
            {props.messages.map((message) => (
              <CSSTransition key={message.id} timeout={200}>
                <Message type={message.type}>
                  <StyledIcon src={iconMap[message.type]} />
                  {message.text}
                </Message>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </MessageWrappers>,
        ref.current
      )
    : null
}

const StyledIcon = styled(Image)`
  width: 20px;
  height: 20px;
  position: absolute;
  top: 10px;
  left: 20px;
`

const MessageWrappers = styled.div`
  position: fixed;
  right: 100px;
  top: 150px;
  z-index: 9999999;
`

const backgroundMap: {
  [key in MessageType]: string
} = {
  [MessageType.Success]: 'rgb(56, 142, 60)',
  [MessageType.Error]: 'rgb(211, 47, 47)',
}

const Message = styled.div<{ type: MessageType }>`
  width: 330px;
  background: ${({ type }) => backgroundMap[type]};
  color: #fff;
  font-size: 14px;
  line-height: 20px;
  padding: 10px;
  padding-left: 50px;
  margin-top: 20px;
  border-radius: 4px;
  transition: all 0.2s linear;
  z-index: 99999;
  position: relative;

  &.enter {
    opacity: 0;
    transform: translateX(100%);
  }

  &.enter-active {
    opacity: 1;
    transform: translateX(0);
  }

  &.exit {
    opacity: 1;
    transform: translateX(0);
  }

  &.exit-active {
    opacity: 0;
    transform: translateX(100%);
  }
`

export function useMessage() {
  return useContext(MessageContext)
}
