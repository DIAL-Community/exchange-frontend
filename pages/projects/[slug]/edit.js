import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import Head from 'next/head'
import { useIntl } from 'react-intl'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { Loading, Error } from '../../../components/shared/FetchStatus'
import ClientOnly from '../../../lib/ClientOnly'
import NotFound from '../../../components/shared/NotFound'
import ProjectForm from '../../../components/projects/ProjectForm'
import { PROJECT_QUERY } from '../../../queries/project'

const EditProject = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { locale, query: { slug } } = useRouter()

  const { loading, error, data } = useQuery(PROJECT_QUERY, {
    variables: { slug: slug, locale: locale },
    skip: !slug,
    context: { headers: { 'Accept-Language': locale } }
  })

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
      {data?.project && (
        <div className='max-w-catalog mx-auto'>
          <ClientOnly>
            <ProjectForm project={data.project} />
          </ClientOnly>
        </div>
      )}
      <Footer />
    </>
  )
}

export default EditProject
