import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { PAGINATED_REGIONS_QUERY } from '../../shared/query/region'
import { FilterContext } from '../../context/FilterContext'
import RegionCard from '../RegionCard'
import { DisplayType } from '../../utils/constants'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_REGIONS_QUERY, {
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
  } else if (!data?.paginatedRegions) {
    return <NotFound />
  }

  const { paginatedRegions: regions } = data

  return (
    <div className='flex flex-col gap-3'>
      {regions.map((region, index) =>
        <div key={index}>
          <RegionCard
            index={index}
            region={region}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
