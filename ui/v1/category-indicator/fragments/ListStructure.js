import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { CATEGORY_INDICATOR_SEARCH_QUERY } from '../../shared/query/categoryIndicator'
import { FilterContext } from '../../../../components/context/FilterContext'
import CategoryIndicatorCard from '../CategoryIndicatorCard'
import { DisplayType } from '../../utils/constants'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'

const ListStructure = () => {
  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(CATEGORY_INDICATOR_SEARCH_QUERY, {
    variables: { search }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.categoryIndicators) {
    return <NotFound />
  }

  const { categoryIndicators } = data

  return (
    <div className='flex flex-col gap-3'>
      {categoryIndicators.map((categoryIndicator, index) =>
        <div key={index}>
          <CategoryIndicatorCard
            index={index}
            categoryIndicator={categoryIndicator}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
