import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { FilterContext } from '../../context/FilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { PAGINATED_STOREFRONTS_QUERY } from '../../shared/query/organization'
import { DisplayType } from '../../utils/constants'
import StorefrontCard from '../StorefrontCard'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search, buildingBlocks, countries, sectors, specialties, certifications } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_STOREFRONTS_QUERY, {
    variables: {
      search,
      countries: countries.map(country => country.value),
      sectors: sectors.map(sector => sector.value),
      specialties: specialties.map(specialty => specialty.value),
      certifications: certifications.map(certification => certification.value),
      buildingBlocks: buildingBlocks.map(buildingBlock => buildingBlock.value),
      limit: defaultPageSize,
      offset: pageOffset
    },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.paginatedStorefronts) {
    return handleMissingData()
  }

  const { paginatedStorefronts: storefronts } = data

  return (
    <div className='flex flex-col gap-3'>
      {storefronts.map((storefront, index) =>
        <div key={index}>
          <StorefrontCard
            index={index}
            storefront={storefront}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
