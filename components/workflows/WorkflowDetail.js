import { gql, useQuery } from '@apollo/client'
import { useEffect } from 'react'
import NotFound from '../shared/NotFound'
import { Error, Loading } from '../shared/FetchStatus'
import WorkflowDetailLeft from './WorkflowDetailLeft'
import WorkflowDetailRight from './WorkflowDetailRight'

const WORKFLOW_QUERY = gql`
  query Workflow($slug: String!) {
    workflow(slug: $slug) {
      id
      name
      slug
      imageFile
      workflowDescription {
        description
        locale
      }
      useCaseSteps {
        slug
        name
        useCase {
          slug
          name
          maturity
          imageFile
        }
      }
      buildingBlocks {
        name
        slug
        maturity
        imageFile
      }
    }
  }
`

const WorkflowDetail = ({ slug, locale }) => {
  const { loading, error, data, refetch } = useQuery(WORKFLOW_QUERY, {
    variables: { slug: slug },
    context: { headers: { 'Accept-Language': locale } },
    skip: !slug
  })

  useEffect(() => {
    refetch()
  }, [locale])

  return (
    <>
      {loading && <Loading />}
      {error && error.networkError && <Error />}
      {error && !error.networkError && <NotFound />}
      {
        data && data.workflow &&
          <div className='flex flex-col lg:flex-row justify-between pb-8 max-w-catalog mx-auto'>
            <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
              <WorkflowDetailLeft workflow={data.workflow} />
            </div>
            <div className='w-full lg:w-2/3 xl:w-3/4'>
              <WorkflowDetailRight workflow={data.workflow} />
            </div>
          </div>
      }
    </>
  )
}

export default WorkflowDetail
