import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import ClientOnly from '../../lib/ClientOnly'
import QueryNotification from '../../components/shared/QueryNotification'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import ContactRibbon from '../../components/contact/ContactRibbon'
import ContactTabNav from '../../components/contact/ContactTabNav'
import ContactMain from '../../components/contact/ContactMain'

const ContactListPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <NextSeo
        title={format('ui.contact.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.contact.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly clientTenant='default'>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <ContactRibbon />
          <ContactTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <ContactMain activeTab={activeTab} />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default ContactListPage
