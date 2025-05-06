import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { FilterContext } from '../../context/FilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { PAGINATED_EXTRA_ATTRIBUTE_DEFINITIONS_QUERY } from '../../shared/query/extraAttributeDefinition'
import { DisplayType } from '../../utils/constants'
import ExtraAttributeDefinitionCard from '../ExtraAttributeDefinitionCard'

const ListStructure = ({ pageOffset, defaultPageSize }) => {
  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_EXTRA_ATTRIBUTE_DEFINITIONS_QUERY, {
    variables: {
      search,
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
  } else if (!data?.paginatedExtraAttributeDefinitions) {
    return handleMissingData()
  }

  const { paginatedExtraAttributeDefinitions: extraAttributeDefinitions } = data

  return (
    <div className='flex flex-col gap-3'>
      {extraAttributeDefinitions.map((extraAttributeDefinition, index) =>
        <div key={index}>
          <ExtraAttributeDefinitionCard
            index={index}
            extraAttributeDefinition={extraAttributeDefinition}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
