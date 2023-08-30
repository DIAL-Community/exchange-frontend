import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { Tooltip } from 'react-tooltip'
import ClientOnly from '../../../../../lib/ClientOnly'
import Header from '../../../../../ui/v1/shared/Header'
import Footer from '../../../../../ui/v1/shared/Footer'
import UseCaseStepCreate from '../../../../../ui/v1/use-case/use-case-step/UseCaseStepCreate'

const CreateUseCaseStepPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()
  const { query: { slug } }= router

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
        <UseCaseStepCreate slug={slug} />
        <Footer />
      </ClientOnly>
    </>
  )
}

export default CreateUseCaseStepPage
