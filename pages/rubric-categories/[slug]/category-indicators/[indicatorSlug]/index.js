import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { Tooltip } from 'react-tooltip'
import ClientOnly from '../../../../../lib/ClientOnly'
import Header from '../../../../../components/shared/Header'
import Footer from '../../../../../components/shared/Footer'
import CategoryIndicatorDetail from '../../../../../components/category-indicator/CategoryIndicatorDetail'

const CategoryIndicatorPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()
  const { query: { slug, indicatorSlug } }= router

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
      <ClientOnly>
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <CategoryIndicatorDetail
          categorySlug={slug}
          indicatorSlug={indicatorSlug}
        />
        <Footer />
      </ClientOnly>
    </>
  )
}

export default CategoryIndicatorPage
