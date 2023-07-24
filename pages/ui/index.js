import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import Header from '../../ui/v1/shared/Header'
import ClientOnly from '../../lib/ClientOnly'
import { Loading } from '../../ui/v1/shared/FetchStatus'
import Footer from '../../ui/v1/shared/Footer'
import { REBRAND_BASE_PATH } from '../../ui/v1/utils/constants'

const UiReroutePage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()

  useEffect(() => {
    router.push(REBRAND_BASE_PATH)
  }, [router])

  return (
    <>
      <NextSeo
        title={format('app.title')}
        description={format('seo.description.about')}
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

export default UiReroutePage
