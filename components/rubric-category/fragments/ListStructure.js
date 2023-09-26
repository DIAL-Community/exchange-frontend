import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { RUBRIC_CATEGORY_SEARCH_QUERY } from '../../shared/query/rubricCategory'
import { FilterContext } from '../../context/FilterContext'
import RubricCategoryCard from '../RubricCategoryCard'
import { DisplayType } from '../../utils/constants'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'

const ListStructure = () => {
  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(RUBRIC_CATEGORY_SEARCH_QUERY, {
    variables: { search }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.rubricCategories) {
    return <NotFound />
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
