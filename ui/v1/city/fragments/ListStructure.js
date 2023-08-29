import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { PAGINATED_CITIES_QUERY } from '../../shared/query/city.js'
import { FilterContext } from '../../../../components/context/FilterContext'
import CityCard from '../CityCard'
import { DisplayType } from '../../utils/constants'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_CITIES_QUERY, {
    variables: {
      search,
      limit: defaultPageSize,
      offset: pageOffset
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.paginatedCities) {
    return <NotFound />
  }

  const { paginatedCities: cities } = data

  return (
    <div className='flex flex-col gap-3'>
      {cities.map((city, index) =>
        <div key={index}>
          <CityCard
            index={index}
            city={city}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
