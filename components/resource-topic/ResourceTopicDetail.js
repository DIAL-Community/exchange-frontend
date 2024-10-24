import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import Breadcrumb from '../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../shared/GraphQueryHandler'
import { RESOURCE_TOPIC_DETAIL_QUERY } from '../shared/query/resourceTopic'
import ResourceTopicDetailLeft from './ResourceTopicDetailLeft'
import ResourceTopicDetailRight from './ResourceTopicDetailRight'

const ResourceTopicDetail = ({ slug }) => {
  const scrollRef = useRef(null)

  const { loading, error, data } = useQuery(RESOURCE_TOPIC_DETAIL_QUERY, {
    variables: { slug },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.resourceTopic) {
    return handleMissingData()
  }

  const { resourceTopic } = data

  const slugNameMapping = (() => {
    const map = {}
    map[resourceTopic.slug] = resourceTopic.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <ResourceTopicDetailLeft scrollRef={scrollRef} resourceTopic={resourceTopic} />
        </div>
        <div className='lg:basis-2/3'>
          <ResourceTopicDetailRight ref={scrollRef} resourceTopic={resourceTopic} />
        </div>
      </div>
    </div>
  )
}

export default ResourceTopicDetail
