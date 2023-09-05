import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Tooltip } from 'react-tooltip'
import Header from '../../../ui/v1/shared/Header'
import ClientOnly from '../../../lib/ClientOnly'
import Footer from '../../../ui/v1/shared/Footer'
import UserDetail from '../../../ui/v1/user/UserDetail'

const User = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { query: { userId } } = useRouter()

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
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <UserDetail userId={userId} />
        <Footer />
      </ClientOnly>
    </>
  )
}

export default User
