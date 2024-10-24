import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { FilterContext } from '../../context/FilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { PAGINATED_ORGANIZATIONS_QUERY } from '../../shared/query/organization'
import { DisplayType } from '../../utils/constants'
import OrganizationCard from '../OrganizationCard'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search, aggregator, countries, endorser, sectors, years } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_ORGANIZATIONS_QUERY, {
    variables: {
      search,
      aggregatorOnly: aggregator,
      countries: countries.map(country => country.value),
      endorserOnly: endorser,
      sectors: sectors.map(sector => sector.value),
      years: years.map(year => year.value),
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
  } else if (!data?.paginatedOrganizations) {
    return handleMissingData()
  }

  const { paginatedOrganizations: organizations } = data

  return (
    <div className='flex flex-col gap-3'>
      {organizations.map((organization, index) =>
        <div key={index}>
          <OrganizationCard
            index={index}
            organization={organization}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
