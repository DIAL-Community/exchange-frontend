import Head from 'next/head'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ClientOnly from '../../../lib/ClientOnly'
import { Loading, Error } from '../../../components/shared/FetchStatus'
import NotFound from '../../../components/shared/NotFound'
import { WORKFLOW_DETAIL_QUERY } from '../../../queries/workflow'
import WorkflowForm from '../../../components/workflows/WorkflowForm'

const CreateWorkflow = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()

  const { locale } = router
  const { slug } = router.query

  const { loading, error, data } = useQuery(WORKFLOW_DETAIL_QUERY, {
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
      {data?.workflow && (
        <div className='max-w-catalog mx-auto'>
          <ClientOnly>
            <WorkflowForm workflow={data.workflow} />
          </ClientOnly>
        </div>
      )}
      <Footer />
    </>
  )
}

export default CreateWorkflow
