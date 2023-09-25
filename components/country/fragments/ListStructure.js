import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { PAGINATED_COUNTRIES_QUERY } from '../../shared/query/country'
import CountryCard from '../CountryCard'
import { DisplayType } from '../../utils/constants'
import { FilterContext } from '../../../../components/context/FilterContext'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_COUNTRIES_QUERY, {
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
  } else if (!data?.paginatedCountries) {
    return <NotFound />
  }

  const { paginatedCountries: countries } = data

  return (
    <div className='flex flex-col gap-3'>
      {countries.map((country, index) =>
        <div key={index}>
          <CountryCard
            index={index}
            country={country}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
