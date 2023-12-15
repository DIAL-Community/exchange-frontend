import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { REGION_DETAIL_QUERY } from '../shared/query/region'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import RegionDetailRight from './RegionDetailRight'
import RegionDetailLeft from './RegionDetailLeft'

const RegionDetail = ({ slug }) => {
  const scrollRef = useRef(null)

  const { loading, error, data } = useQuery(REGION_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.region) {
    return <NotFound />
  }

  const { region } = data

  const slugNameMapping = (() => {
    const map = {}
    map[region.slug] = region.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <RegionDetailLeft scrollRef={scrollRef} region={region} />
        </div>
        <div className='lg:basis-2/3'>
          <RegionDetailRight ref={scrollRef} region={region} />
        </div>
      </div>
    </div>
  )
}

export default RegionDetail
