import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import Head from 'next/head'
import { useIntl } from 'react-intl'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { Loading, Error } from '../../../components/shared/FetchStatus'
import ClientOnly from '../../../lib/ClientOnly'
import NotFound from '../../../components/shared/NotFound'
import DatasetForm from '../../../components/datasets/DatasetForm'

const DATASET_QUERY = gql`
  query Dataset($slug: String!) {
    dataset(slug: $slug) {
      id
      name
      slug
      website
      visualizationUrl
      geographicCoverage
      timeRange
      aliases
      datasetDescription {
        description
        locale
      }
    }
  }
`

const EditOrganization = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()

  const { locale } = router
  const { slug } = router.query
  const { loading, error, data, refetch } = useQuery(DATASET_QUERY, {
    variables: { slug: slug, locale: locale },
    skip: !slug,
    context: { headers: { 'Accept-Language': locale } }
  })

  useEffect(() => {
    refetch()
  }, [refetch])

  if (loading) {
    return <Loading />
  } else if (error && error.networkError) {
    return <Error />
  } else if (error && !error.networkError) {
    return <NotFound />
  }

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      {data && data.dataset && (
        <div className='max-w-catalog mx-auto'>
          <ClientOnly>
            <DatasetForm dataset={data.dataset} />
          </ClientOnly>
        </div>
      )}
      <Footer />
    </>
  )
}

export default EditOrganization
