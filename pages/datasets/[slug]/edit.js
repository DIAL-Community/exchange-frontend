import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
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
      license
      languages
      dataFormat
      aliases
      datasetDescription {
        description
        locale
      }
    }
  }
`

const EditOrganization = () => {
  const router = useRouter()

  const { locale } = router
  const { slug } = router.query
  const { loading, error, data, refetch } = useQuery(DATASET_QUERY, {
    variables: { slug, locale },
    skip: !slug,
    context: { headers: { 'Accept-Language': locale } }
  })

  useEffect(() => {
    refetch()
  }, [refetch])

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.dataset) {
    return <NotFound />
  }

  return (
    <>
      <Header />
      {data && data.dataset && (
        <ClientOnly>
          <DatasetForm dataset={data.dataset} />
        </ClientOnly>
      )}
      <Footer />
    </>
  )
}

export default EditOrganization
