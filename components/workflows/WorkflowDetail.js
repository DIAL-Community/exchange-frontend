import { useQuery } from '@apollo/client'
import NotFound from '../shared/NotFound'
import { Error, Loading } from '../shared/FetchStatus'
import { useUser } from '../../lib/hooks'
import { WORKFLOW_DETAIL_QUERY } from '../../queries/workflow'
import WorkflowDetailLeft from './WorkflowDetailLeft'
import WorkflowDetailRight from './WorkflowDetailRight'

const WorkflowDetail = ({ slug, locale }) => {
  const { loading, error, data } = useQuery(WORKFLOW_DETAIL_QUERY, {
    variables: { slug },
    context: { headers: { 'Accept-Language': locale } },
    skip: !slug
  })

  const { isAdminUser: canEdit } = useUser()

  return (
    <>
      {loading && <Loading />}
      {error && error.networkError && <Error />}
      {error && !error.networkError && <NotFound />}
      {
        data?.workflow &&
          <div className='flex flex-col lg:flex-row justify-between pb-8'>
            <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
              <WorkflowDetailLeft workflow={data.workflow} />
            </div>
            <div className='w-full lg:w-2/3 xl:w-3/4'>
              <WorkflowDetailRight workflow={data.workflow} canEdit={canEdit} />
            </div>
          </div>
      }
    </>
  )
}

export default WorkflowDetail
