import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import ClientOnly from '../../lib/ClientOnly'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import UserRibbon from '../../components/profile/ProfileRibbon'
import UserTabNav from '../../components/profile/ProfileTabNav'
import UserMain from '../../components/profile/ProfileMain'
import { useUser } from '../../lib/hooks'
import { handleLoadingSession, handleSessionError } from '../../components/shared/SessionQueryHandler'

const UserPage = ({ defaultTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user, loadingUserSession } = useUser()
  const [activeTab, setActiveTab] = useState(0)

  const router = useRouter()

  useEffect(() => {
    const id = setTimeout(() => {
      if (!user) {
        router.push('/')
      }
    }, 1000)

    return () => {
      clearTimeout(id)
    }
  }, [router, user])

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
      <ClientOnly clientTenants={defaultTenants}>
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        {loadingUserSession
          ? handleLoadingSession()
          : !user
            ? handleSessionError()
            : (
              <div className='min-h-[80vh]'>
                <div className='flex flex-col'>
                  <UserRibbon />
                  <UserTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
                  <UserMain activeTab={activeTab} />
                </div>
              </div>
            )
        }
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

export default UserPage
