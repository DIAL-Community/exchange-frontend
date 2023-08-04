import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { SECTOR_DETAIL_QUERY } from '../shared/query/sector'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import SectorDetailRight from './SectorDetailRight'
import SectorDetailLeft from './SectorDetailLeft'

const SectorDetail = ({ slug }) => {
  const scrollRef = useRef(null)
  const commentsSectionRef = useRef(null)

  const { loading, error, data } = useQuery(SECTOR_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.sector) {
    return <NotFound />
  }

  const { sector } = data

  const slugNameMapping = (() => {
    const map = {}
    map[sector.slug] = sector.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <SectorDetailLeft scrollRef={scrollRef} sector={sector} />
        </div>
        <div className='lg:basis-2/3'>
          <SectorDetailRight ref={scrollRef} commentsSectionRef={commentsSectionRef} sector={sector} />
        </div>
      </div>
    </div>
  )
}

export default SectorDetail
