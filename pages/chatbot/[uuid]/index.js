import { useCallback } from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import ChatbotMain from '../../../components/chatbot/ChatbotMain'
import Footer from '../../../components/shared/Footer'
import Header from '../../../components/shared/Header'
import ClientOnly from '../../../lib/ClientOnly'

const ChatbotPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { query: { uuid } } = useRouter()

  return (
    <>
      <NextSeo
        title={format('ui.chatbot.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.chatbot.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly clientTenant='default'>
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <ChatbotMain existingSessionIdentifier={uuid} />
        <Footer />
      </ClientOnly>
    </>
  )
}

export default ChatbotPage
