import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import { Loading } from '../../../../components/shared/FetchStatus'
import Header from '../../../../components/shared/Header'
import Footer from '../../../../components/shared/Footer'
import ClientOnly from '../../../../lib/ClientOnly'

const RubricCategoryIndicatorsPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()
  const { query: { slug } }= router

  useEffect(() => {
    router.push(`/rubric-categories/${slug}`)
  }, [router, slug])

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
      <ClientOnly clientTenant='default'>
        <Header />
        <Loading />
        <Footer />
      </ClientOnly>
    </>
  )
}

export default RubricCategoryIndicatorsPage
