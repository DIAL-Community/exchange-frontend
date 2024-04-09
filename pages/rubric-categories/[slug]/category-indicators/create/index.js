import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { Tooltip } from 'react-tooltip'
import ClientOnly from '../../../../../lib/ClientOnly'
import Header from '../../../../../components/shared/Header'
import Footer from '../../../../../components/shared/Footer'
import CategoryIndicatorCreate from '../../../../../components/category-indicator/CategoryIndicatorCreate'

const CreateCategoryIndicatorPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()
  const { query: { slug } }= router

  return (
    <>
      <NextSeo
        title={format('categoryIndicator.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('categoryIndicator.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly clientTenant='default'>
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <CategoryIndicatorCreate categorySlug={slug} />
        <Footer />
      </ClientOnly>
    </>
  )
}

export default CreateCategoryIndicatorPage
