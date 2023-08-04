import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { COUNTRY_DETAIL_QUERY } from '../shared/query/country'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import CountryDetailRight from './CountryDetailRight'
import CountryDetailLeft from './CountryDetailLeft'

const CountryDetail = ({ slug }) => {
  const scrollRef = useRef(null)
  const commentsSectionRef = useRef(null)

  const { loading, error, data } = useQuery(COUNTRY_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.country) {
    return <NotFound />
  }

  const { country } = data

  const slugNameMapping = (() => {
    const map = {}
    map[country.slug] = country.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <CountryDetailLeft scrollRef={scrollRef} country={country} />
        </div>
        <div className='lg:basis-2/3'>
          <CountryDetailRight ref={scrollRef} commentsSectionRef={commentsSectionRef} country={country} />
        </div>
      </div>
    </div>
  )
}

export default CountryDetail
