import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { CITY_DETAIL_QUERY } from '../shared/query/city'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import CityDetailRight from './CityDetailRight'
import CityDetailLeft from './CityDetailLeft'

const CityDetail = ({ slug }) => {
  const scrollRef = useRef(null)
  const commentsSectionRef = useRef(null)

  const { loading, error, data } = useQuery(CITY_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.city) {
    return <NotFound />
  }

  const { city } = data

  const slugNameMapping = (() => {
    const map = {}
    map[city.slug] = city.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <CityDetailLeft scrollRef={scrollRef} city={city} />
        </div>
        <div className='lg:basis-2/3'>
          <CityDetailRight ref={scrollRef} commentsSectionRef={commentsSectionRef} city={city} />
        </div>
      </div>
    </div>
  )
}

export default CityDetail
