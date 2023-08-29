import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import { useCallback, useState } from 'react'
import QueryNotification from '../../components/shared/QueryNotification'
import ClientOnly from '../../lib/ClientOnly'
import Header from '../../ui/v1/shared/Header'
import Footer from '../../ui/v1/shared/Footer'
import PlaybookRibbon from '../../ui/v1/playbook/PlaybookRibbon'
import PlaybookTabNav from '../../ui/v1/playbook/PlaybookTabNav'
import PlaybookMain from '../../ui/v1/playbook/PlaybookMain'

const Playbooks = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <NextSeo
        title={format('ui.playbook.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.playbook.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <PlaybookRibbon />
          <PlaybookTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <PlaybookMain activeTab={activeTab} />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default Playbooks
