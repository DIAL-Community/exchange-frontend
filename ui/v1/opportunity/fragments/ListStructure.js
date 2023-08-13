import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { Error, Loading } from '../../../../components/shared/FetchStatus'
import { PAGINATED_OPPORTUNITIES_QUERY } from '../../shared/query/opportunity'
import { OpportunityFilterContext } from '../../../../components/context/OpportunityFilterContext'
import OpportunityCard from '../OpportunityCard'
import { DisplayType } from '../../utils/constants'
import { NotFound } from '../../shared/FetchStatus'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(OpportunityFilterContext)
  const { useCases, buildingBlocks, sectors, tags } = useContext(OpportunityFilterContext)

  const { loading, error, data } = useQuery(PAGINATED_OPPORTUNITIES_QUERY, {
    variables: {
      search,
      useCases: useCases.map(useCase => useCase.value),
      buildingBlocks: buildingBlocks.map(buildingBlock => buildingBlock.value),
      sectors: sectors.map(sector => sector.value),
      tags: tags.map(tag => tag.label),
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
