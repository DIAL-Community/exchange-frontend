import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { Loading, Error } from '../../../components/shared/FetchStatus'
import ClientOnly from '../../../lib/ClientOnly'
import NotFound from '../../../components/shared/NotFound'
import ProjectForm from '../../../components/projects/ProjectForm'
import { PROJECT_QUERY } from '../../../queries/project'

const EditProject = () => {
  const { locale, query: { slug } } = useRouter()

  const { loading, error, data } = useQuery(PROJECT_QUERY, {
    variables: { slug, locale },
    skip: !slug,
    context: { headers: { 'Accept-Language': locale } }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.project) {
    return <NotFound />
  }

  return (
    <>
      <Header />
      <ClientOnly>
        { data?.project && <ProjectForm project={data.project} /> }
      </ClientOnly>
      <Footer />
    </>
  )
}

export default EditProject
