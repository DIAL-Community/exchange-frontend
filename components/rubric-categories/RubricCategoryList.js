import { useCallback, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { FilterContext } from '../context/FilterContext'
import { UserFilterContext } from '../context/UserFilterContext'
import { Loading, Error } from '../shared/FetchStatus'
import NotFound from '../shared/NotFound'
import Card from '../shared/Card'
import { RUBRIC_CATEGORIES_LIST_QUERY } from '../../queries/rubric-category'

const RubricCategoryList = ({ rubricCategoryList }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='grid grid-cols-1'>
      {rubricCategoryList.length
        ? rubricCategoryList.map((rubricCategory, rubricCategoryIdx) => (
          <Card
            key={rubricCategoryIdx}
            href={`rubric_categories/${rubricCategory.slug}`}
            className='flex flex-col font-semibold text-button-gray items-center'
          >
            <div className='flex flex-row gap-3'>
              {rubricCategory.name}
              <div className='text-button-gray-light text-sm ml-auto'>
                {format('rubric-category.weight')}: {rubricCategory.weight}
              </div>
            </div>
          </Card>
        )) : (
          <div className='col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 px-6'>
            {format('noResults.entity', { entity: format('rubric-categories.header') })}
          </div>
        )
      }
    </div>
  )
}

const RubricCategoryListQuery = () => {
  const { setResultCounts } = useContext(FilterContext)
  const { search } = useContext(UserFilterContext)

  const { loading, error, data } = useQuery(RUBRIC_CATEGORIES_LIST_QUERY, {
    variables: { search },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first'
  })

  useEffect(() => {
    if (data) {
      setResultCounts(resultCounts => {
        return {
          ...resultCounts,
          ...{ [['filter.entity.rubric-categories']]: data.rubricCategories.totalCount }
        }
      })
    }
  }, [data, setResultCounts])

  if (loading) {
    return <Loading />
  } else if (error && error.networkError) {
    return <Error />
  } else if (error && !error.networkError) {
    return <NotFound />
  }

  return <RubricCategoryList rubricCategoryList={data.rubricCategories.nodes} />
}

export default RubricCategoryListQuery
