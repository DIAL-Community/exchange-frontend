import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import ResourceForm from '../../../../components/resources/fragments/ResourceForm'
import { Error, Loading, NotFound } from '../../../../components/shared/FetchStatus'
import Footer from '../../../../components/shared/Footer'
import Header from '../../../../components/shared/Header'
import { ORGANIZATION_DETAIL_QUERY } from '../../../../components/shared/query/organization'
import ClientOnly from '../../../../lib/ClientOnly'

const CreateResource = () => {
  const { locale, query } = useRouter()
  const { slug } = query

  const { loading, error, data } = useQuery(ORGANIZATION_DETAIL_QUERY, {
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
      <ClientOnly clientTenant='default'>
        <ResourceForm storefront={data?.storefront} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default CreateResource
