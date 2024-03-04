import { useQuery } from '@apollo/client'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { COUNTRY_DETAIL_QUERY } from '../../shared/query/country'
import DpiCountryDetail from '../fragments/DpiCountryDetail'
import DpiBreadcrumb from './DpiBreadcrumb'

const DpiCountry = ({ slug }) => {
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
    <div className='px-4 lg:px-8 xl:px-56 min-h-[70vh] py-8'>
      <div className='flex flex-col gap-6'>
        <DpiBreadcrumb slugNameMapping={slugNameMapping} />
        <DpiCountryDetail country={country} />
      </div>
    </div>
  )
}

export default DpiCountry
