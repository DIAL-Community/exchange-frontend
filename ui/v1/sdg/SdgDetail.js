import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { SDG_DETAIL_QUERY } from '../shared/query/sdg'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import SdgDetailRight from './SdgDetailRight'
import SdgDetailLeft from './SdgDetailLeft'

const SdgDetail = ({ slug }) => {
  const scrollRef = useRef(null)

  const { loading, error, data } = useQuery(SDG_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.sdg) {
    return <NotFound />
  }

  const { sdg } = data

  const slugNameMapping = (() => {
    const map = {}
    map[sdg.slug] = sdg.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <SdgDetailLeft scrollRef={scrollRef} sdg={sdg} />
        </div>
        <div className='lg:basis-2/3'>
          <SdgDetailRight ref={scrollRef} sdg={sdg} />
        </div>
      </div>
    </div>
  )
}

export default SdgDetail
