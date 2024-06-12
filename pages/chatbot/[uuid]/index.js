import { useCallback } from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import ChatbotMain from '../../../components/chatbot/ChatbotMain'
import Footer from '../../../components/shared/Footer'
import Header from '../../../components/shared/Header'
import ClientOnly from '../../../lib/ClientOnly'

const ChatbotPage = ({ defaultTenants }) => {
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
      <ClientOnly clientTenants={defaultTenants}>
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <ChatbotMain existingSessionIdentifier={uuid} />
        <Footer />
      </ClientOnly>
    </>
  )
}

export async function getServerSideProps() {
  const response = await fetch(process.env.NEXTAUTH_URL + '/api/tenants')
  const { defaultTenants } = await response.json()

  // Passing data to the page as props
  return { props: { defaultTenants } }
}

export default ChatbotPage
