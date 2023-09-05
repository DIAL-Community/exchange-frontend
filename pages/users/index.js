import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import ClientOnly from '../../lib/ClientOnly'
import QueryNotification from '../../components/shared/QueryNotification'
import Header from '../../ui/v1/shared/Header'
import Footer from '../../ui/v1/shared/Footer'
import UserRibbon from '../../ui/v1/user/UserRibbon'
import UserTabNav from '../../ui/v1/user/UserTabNav'
import UserMain from '../../ui/v1/user/UserMain'

const Users = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <NextSeo
        title={format('ui.user.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.user.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <UserRibbon />
          <UserTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <UserMain activeTab={activeTab} />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default Users
