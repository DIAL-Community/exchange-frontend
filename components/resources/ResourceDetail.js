import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import { RESOURCE_DETAIL_QUERY } from '../shared/query/resource'
import ResourceDetailLeft from './ResourceDetailLeft'
import ResourceDetailRight from './ResourceDetailRight'

const ResourceDetail = ({ slug }) => {
  const scrollRef = useRef(null)

  const { loading, error, data } = useQuery(RESOURCE_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.resource) {
    return <NotFound />
  }

  const { resource } = data

  const slugNameMapping = (() => {
    const map = {}
    map['resources'] = 'resources'
    map['dpi-resources'] = 'dpi-resources'
    map[resource.slug] = resource.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <ResourceDetailLeft scrollRef={scrollRef} resource={resource} />
        </div>
        <div className='lg:basis-2/3'>
          <ResourceDetailRight ref={scrollRef} resource={resource} />
        </div>
      </div>
    </div>
  )
}

export default ResourceDetail
