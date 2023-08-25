import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { Tooltip } from 'react-tooltip'
import ClientOnly from '../../../../../lib/ClientOnly'
import Header from '../../../../../ui/v1/shared/Header'
import Footer from '../../../../../ui/v1/shared/Footer'
import CategoryIndicatorEdit from '../../../../../ui/v1/category-indicator/CategoryIndicatorEdit'

const EditRubricCategoryPage = () => {
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
        <CategoryIndicatorEdit
          categorySlug={slug}
          indicatorSlug={indicatorSlug}
        />
        <Footer />
      </ClientOnly>
    </>
  )
}

export default EditRubricCategoryPage
