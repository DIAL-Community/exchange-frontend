import { NextSeo } from 'next-seo'
import { useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import ClientOnly from '../../lib/ClientOnly'
import Header from '../../ui/v1/shared/Header'
import Footer from '../../ui/v1/shared/Footer'
import UserRibbon from '../../ui/v1/profile/ProfileRibbon'
import UserTabNav from '../../ui/v1/profile/ProfileTabNav'
import UserMain from '../../ui/v1/profile/ProfileMain'
import { Loading, Unauthorized } from '../../ui/v1/shared/FetchStatus'
import { useUser } from '../../lib/hooks'

const UserPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user, loadingUserSession } = useUser()
  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <NextSeo
        title={format('user.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.useCase.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        {loadingUserSession
          ? <Loading />
          : !user
            ? <Unauthorized />
            : <div className='min-h-[80vh]'>
              <div className='flex flex-col'>
                <UserRibbon />
                <UserTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
                <UserMain activeTab={activeTab} />
              </div>
            </div>
        }
        <Footer />
      </ClientOnly>
    </>
  )
}

export default UserPage
