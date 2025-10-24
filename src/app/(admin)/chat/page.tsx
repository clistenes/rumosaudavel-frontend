import type { Metadata } from 'next'

import ChatArea from './components/ChatArea'
import ChatListPanel from './components/ChatListPanel'
import { Col, Row } from 'react-bootstrap'
import { ChatProvider } from '@/context/useChatContext'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = { title: 'Chat' }

const Chat = () => {
  return (
    <>
    <PageTitle title='Chat' subName='Apps' />
    <Row>
      <Col xs={12}>
        <ChatProvider>
          <ChatListPanel />
          <ChatArea />
        </ChatProvider>
      </Col>
    </Row>
    </>
  )
}

export default Chat
