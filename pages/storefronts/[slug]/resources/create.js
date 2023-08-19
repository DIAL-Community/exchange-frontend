import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import Footer from '../../../../components/Footer'
import Header from '../../../../components/Header'
import ResourceForm from '../../../../components/resources/ResourceForm'
import ClientOnly from '../../../../lib/ClientOnly'
import { Error, Loading } from '../../../../components/shared/FetchStatus'
import NotFound from '../../../../components/shared/NotFound'
import { ORGANIZATION_QUERY } from '../../../../queries/storefront'

const CreateResource = () => {
  const { locale, query } = useRouter()
  const { slug } = query

  const { loading, error, data } = useQuery(ORGANIZATION_QUERY, {
    variables: { slug },
    context: { headers: { 'Accept-Language': locale } },
    skip: !slug
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.storefront) {
    return <NotFound />
  }

  return (
    <>
      <Header />
      <ClientOnly>
        <ResourceForm storefront={data?.storefront} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default CreateResource
