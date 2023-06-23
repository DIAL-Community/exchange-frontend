import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { Tooltip } from 'react-tooltip'
import Header from '../../../../../../../ui/v1/shared/Header'
import ClientOnly from '../../../../../../../lib/ClientOnly'
import Footer from '../../../../../../../ui/v1/shared/Footer'
import UseCaseStepDetail from '../../../../../../../ui/v1/use-case/use-case-step/UseCaseStepDetail'

const UseCaseStepPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()
  const { query: { slug, stepSlug } }= router

  return (
    <>
      <NextSeo
        title={format('use-case.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('use-case.header')?.toLocaleLowerCase() }
          )
        }
      />
      <Header />
      <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
      <ClientOnly>
        <UseCaseStepDetail slug={slug} stepSlug={stepSlug} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default UseCaseStepPage
