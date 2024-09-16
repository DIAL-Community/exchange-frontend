import { useQuery } from '@apollo/client'
import { useContext } from 'react'
import { FilterContext } from '../../context/FilterContext'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { PAGINATED_OPPORTUNITIES_QUERY } from '../../shared/query/opportunity'
import { DisplayType } from '../../utils/constants'
import OpportunityCard from '../OpportunityCard'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const {
    search,
    buildingBlocks,
    countries,
    organizations,
    sectors,
    showClosed,
    showGovStackOnly,
    tags,
    useCases
  } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_OPPORTUNITIES_QUERY, {
    variables: {
      search,
      buildingBlocks: buildingBlocks.map(buildingBlock => buildingBlock.value),
      countries: countries.map(country => country.value),
      organizations: organizations.map(organization => organization.value),
      sectors: sectors.map(sector => sector.value),
      showClosed,
      showGovStackOnly,
      tags: tags.map(tag => tag.label),
      useCases: useCases.map(useCase => useCase.value),
      limit: defaultPageSize,
      offset: pageOffset
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.paginatedOpportunities) {
    return <NotFound />
  }

  const { paginatedOpportunities: opportunities } = data

  return (
    <div className='flex flex-col gap-3'>
      {opportunities.map((opportunity, index) =>
        <div key={index}>
          <OpportunityCard
            index={index}
            opportunity={opportunity}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
