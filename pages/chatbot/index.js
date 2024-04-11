import { useCallback } from 'react'
import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import ChatbotMain from '../../components/chatbot/ChatbotMain'
import Footer from '../../components/shared/Footer'
import Header from '../../components/shared/Header'
import QueryNotification from '../../components/shared/QueryNotification'
import ClientOnly from '../../lib/ClientOnly'

const ChatbotPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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
      <ClientOnly clientTenants={['default', 'fao']}>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <ChatbotMain />
        <Footer />
      </ClientOnly>
    </>
  )
}

export default ChatbotPage
