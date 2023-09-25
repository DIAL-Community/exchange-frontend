import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { PAGINATED_OPPORTUNITIES_QUERY } from '../../shared/query/opportunity'
import { OpportunityFilterContext } from '../../context/OpportunityFilterContext'
import OpportunityCard from '../OpportunityCard'
import { DisplayType } from '../../utils/constants'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(OpportunityFilterContext)
  const {
    buildingBlocks,
    countries,
    organizations,
    sectors,
    useCases,
    tags,
    showClosed
  } = useContext(OpportunityFilterContext)

  const { loading, error, data } = useQuery(PAGINATED_OPPORTUNITIES_QUERY, {
    variables: {
      search,
      countries: countries.map(country => country.value),
      buildingBlocks: buildingBlocks.map(buildingBlock => buildingBlock.value),
      organizations: organizations.map(organization => organization.value),
      useCases: useCases.map(useCase => useCase.value),
      sectors: sectors.map(sector => sector.value),
      tags: tags.map(tag => tag.label),
      showClosed,
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
