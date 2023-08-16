import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { WORKFLOW_DETAIL_QUERY } from '../shared/query/workflow'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import WorkflowDetailRight from './WorkflowDetailRight'
import WorkflowDetailLeft from './WorkflowDetailLeft'

const WorkflowDetail = ({ slug }) => {
  const scrollRef = useRef(null)

  const { loading, error, data } = useQuery(WORKFLOW_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.workflow) {
    return <NotFound />
  }

  const { workflow } = data

  const slugNameMapping = (() => {
    const map = {}
    map[workflow.slug] = workflow.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <WorkflowDetailLeft scrollRef={scrollRef} workflow={workflow} />
        </div>
        <div className='lg:basis-2/3'>
          <WorkflowDetailRight ref={scrollRef} workflow={workflow} />
        </div>
      </div>
    </div>
  )
}

export default WorkflowDetail
