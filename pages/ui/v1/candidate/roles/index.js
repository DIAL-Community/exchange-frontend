import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import QueryNotification from '../../../../../components/shared/QueryNotification'
import ClientOnly from '../../../../../lib/ClientOnly'
import Header from '../../../../../ui/v1/shared/Header'
import Footer from '../../../../../ui/v1/shared/Footer'
import RoleRibbon from '../../../../../ui/v1/candidate/role/RoleRibbon'
import RoleTabNav from '../../../../../ui/v1/candidate/role/RoleTabNav'
import RoleMain from '../../../../../ui/v1/candidate/role/RoleMain'

const RoleListPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <NextSeo
        title={format('ui.candidateRole.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.candidateRole.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <RoleRibbon />
          <RoleTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <RoleMain activeTab={activeTab} />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default RoleListPage
