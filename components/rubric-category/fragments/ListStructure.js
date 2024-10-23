import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { FilterContext } from '../../context/FilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { RUBRIC_CATEGORY_SEARCH_QUERY } from '../../shared/query/rubricCategory'
import { DisplayType } from '../../utils/constants'
import RubricCategoryCard from '../RubricCategoryCard'

const ListStructure = () => {
  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(RUBRIC_CATEGORY_SEARCH_QUERY, {
    variables: { search },
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
  } else if (!data?.rubricCategories) {
    return handleMissingData()
  }

  const { rubricCategories } = data

  return (
    <div className='flex flex-col gap-3'>
      {rubricCategories.map((rubricCategory, index) =>
        <div key={index}>
          <RubricCategoryCard
            index={index}
            rubricCategory={rubricCategory}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
