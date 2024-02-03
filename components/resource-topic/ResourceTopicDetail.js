import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import { RESOURCE_TOPIC_DETAIL_QUERY } from '../shared/query/resourceTopic'
import ResourceTopicDetailLeft from './ResourceTopicDetailLeft'
import ResourceTopicDetailRight from './ResourceTopicDetailRight'

const ResourceTopicDetail = ({ slug }) => {
  const scrollRef = useRef(null)

  const { loading, error, data } = useQuery(RESOURCE_TOPIC_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.resourceTopic) {
    return <NotFound />
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
