import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Tooltip } from 'react-tooltip'
import Header from '../../../components/shared/Header'
import ClientOnly from '../../../lib/ClientOnly'
import Footer from '../../../components/shared/Footer'
import RubricCategoryEdit from '../../../components/rubric-category/RubricCategoryEdit'

const EditRubricCategoryPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { locale, query: { slug } } = useRouter()

  return (
    <>
      <NextSeo
        title={format('ui.rubricCategory.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.rubricCategory.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly clientTenants={['default', 'fao']}>
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <RubricCategoryEdit categorySlug={slug} locale={locale} />
        <Footer />
      </ClientOnly>
    </>
  )
}

export default EditRubricCategoryPage
