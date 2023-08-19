import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { ORGANIZATION_DETAIL_QUERY } from '../../../../ui/v1/shared/query/organization'
import { Error, Loading, NotFound } from '../../../../ui/v1/shared/FetchStatus'
import Header from '../../../../ui/v1/shared/Header'
import ClientOnly from '../../../../lib/ClientOnly'
import Footer from '../../../../ui/v1/shared/Footer'
import ProjectForm from '../../../../ui/v1/project/fragments/ProjectForm'

const CreateProject = () => {
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
      <ClientOnly>
        <ProjectForm storefront={data?.storefront} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default CreateProject
