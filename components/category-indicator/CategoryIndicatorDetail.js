import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { CATEGORY_INDICATOR_QUERY } from '../shared/query/categoryIndicator'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import CategoryIndicatorDetailRight from './CategoryIndicatorDetailRight'
import CategoryIndicatorDetailLeft from './CategoryIndicatorDetailLeft'

const CategoryIndicatorDetail = ({ categorySlug, indicatorSlug }) => {
  const scrollRef = useRef(null)

  const { loading, error, data } = useQuery(CATEGORY_INDICATOR_QUERY, {
    variables: { categorySlug, indicatorSlug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.categoryIndicator && !data.rubricCategory) {
    return <NotFound />
  }

  const { categoryIndicator, rubricCategory } = data

  const slugNameMapping = (() => {
    const map = {}
    map[rubricCategory.slug] = rubricCategory.name
    map[categoryIndicator.slug] = categoryIndicator.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <CategoryIndicatorDetailLeft
            scrollRef={scrollRef}
            rubricCategory={rubricCategory}
            categoryIndicator={categoryIndicator}
          />
        </div>
        <div className='lg:basis-2/3'>
          <CategoryIndicatorDetailRight
            ref={scrollRef}
            rubricCategory={rubricCategory}
            categoryIndicator={categoryIndicator}
          />
        </div>
      </div>
    </div>
  )
}

export default CategoryIndicatorDetail
