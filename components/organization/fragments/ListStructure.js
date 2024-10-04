import { useQuery } from '@apollo/client'
import { useContext } from 'react'
import { FilterContext } from '../../context/FilterContext'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
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
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.paginatedOrganizations) {
    return <NotFound />
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
