import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ClientOnly from '../../../lib/ClientOnly'
import { Loading, Error } from '../../../components/shared/FetchStatus'
import NotFound from '../../../components/shared/NotFound'
import { RESOURCE_DETAIL_QUERY } from '../../../queries/resource'
import ResourceForm from '../../../components/resources/ResourceForm'

const EditResource = () => {
  const router = useRouter()

  const { locale } = router
  const { slug } = router.query

  const { loading, error, data } = useQuery(RESOURCE_DETAIL_QUERY, {
    variables: { slug, locale },
    skip: !slug,
    context: { headers: { 'Accept-Language': locale } }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.resource) {
    return <NotFound />
  }

  return (
    <>
      <Header />
      <ClientOnly>
        {data?.resource && <ResourceForm resource={data.resource} />}
      </ClientOnly>
      <Footer />
    </>
  )
}

export default EditResource
