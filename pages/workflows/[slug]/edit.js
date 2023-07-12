import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ClientOnly from '../../../lib/ClientOnly'
import { Loading, Error } from '../../../components/shared/FetchStatus'
import NotFound from '../../../components/shared/NotFound'
import { WORKFLOW_DETAIL_QUERY } from '../../../queries/workflow'
import WorkflowForm from '../../../components/workflows/WorkflowForm'

const EditWorkflow = () => {
  const router = useRouter()

  const { locale } = router
  const { slug } = router.query

  const { loading, error, data } = useQuery(WORKFLOW_DETAIL_QUERY, {
    variables: { slug, locale },
    skip: !slug,
    context: { headers: { 'Accept-Language': locale } }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.workflow) {
    return <NotFound />
  }

  return (
    <>
      <Header />
      <ClientOnly>
        {data?.workflow && <WorkflowForm workflow={data.workflow} />}
      </ClientOnly>
      <Footer />
    </>
  )
}

export default EditWorkflow
