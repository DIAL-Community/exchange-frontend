import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import ClientOnly from '../../lib/ClientOnly'
import Header from '../../ui/v1/shared/Header'
import { Loading } from '../../ui/v1/shared/FetchStatus'
import Footer from '../../ui/v1/shared/Footer'

const UserListPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()

  useEffect(() => {
    router.push('/')
  }, [router])

  return (
    <>
      <NextSeo
        title={format('ui.useCase.header')}
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
        <Loading />
        <Footer />
      </ClientOnly>
    </>
  )
}

export default UserListPage
