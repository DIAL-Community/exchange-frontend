import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { PAGINATED_ORGANIZATIONS_QUERY } from '../../shared/query/organization'
import { OrganizationFilterContext } from '../../context/OrganizationFilterContext'
import OrganizationCard from '../OrganizationCard'
import { DisplayType } from '../../utils/constants'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(OrganizationFilterContext)

  const { aggregator, endorser, sectors, countries, years } = useContext(OrganizationFilterContext)

  const { loading, error, data } = useQuery(PAGINATED_ORGANIZATIONS_QUERY, {
    variables: {
      search,
      countries: countries.map(country => country.value),
      sectors: sectors.map(sector => sector.value),
      years: years.map(year => year.value),
      aggregatorOnly: aggregator,
      endorserOnly: endorser,
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
