import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { SYNC_DETAIL_QUERY } from '../shared/query/sync'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import SyncDetailRight from './SyncDetailRight'
import SyncDetailLeft from './SyncDetailLeft'

const SyncDetail = ({ slug }) => {
  const scrollRef = useRef(null)

  const { loading, error, data } = useQuery(SYNC_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.sync) {
    return <NotFound />
  }

  const { sync } = data

  const slugNameMapping = (() => {
    const map = {}
    map[sync.slug] = sync.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <SyncDetailLeft scrollRef={scrollRef} sync={sync} />
        </div>
        <div className='lg:basis-2/3'>
          <SyncDetailRight ref={scrollRef} sync={sync} />
        </div>
      </div>
    </div>
  )
}

export default SyncDetail
