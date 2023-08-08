import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import { Tooltip } from 'react-tooltip'
import { Loading } from '../../../../../../ui/v1/shared/FetchStatus'
import { REBRAND_BASE_PATH } from '../../../../../../ui/v1/utils/constants'
import Header from '../../../../../../ui/v1/shared/Header'
import Footer from '../../../../../../ui/v1/shared/Footer'
import ClientOnly from '../../../../../../lib/ClientOnly'

const UseCaseStepListPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()
  const { query: { slug } }= router

  useEffect(() => {
    router.push(`${REBRAND_BASE_PATH}/use-cases/${slug}`)
  }, [router, slug])

  return (
    <>
      <NextSeo
        title={format('ui.useCase.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('use-case.header')?.toLocaleLowerCase() }
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

export default UseCaseStepListPage
