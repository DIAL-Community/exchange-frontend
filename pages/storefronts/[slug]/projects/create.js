import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import ClientOnly from '../../../../lib/ClientOnly'
import ProjectForm from '../../../../components/projects/ProjectForm'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import { ORGANIZATION_QUERY } from '../../../../queries/storefront'
import { Error, Loading } from '../../../../components/shared/FetchStatus'
import NotFound from '../../../../components/shared/NotFound'

const CreateProject = () => {
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
        <ProjectForm storefront={data?.storefront} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default CreateProject
