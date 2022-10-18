import { useQuery } from '@apollo/client'
import { useEffect, useMemo } from 'react'
import NotFound from '../shared/NotFound'
import { Error, Loading } from '../shared/FetchStatus'
import { CATEGORY_INDICATOR_QUERY } from '../../queries/category-indicator'
import { RUBRIC_CATEGORY_QUERY } from '../../queries/rubric-category'
import CategoryIndicatorDetailLeft from './CategoryIndicatorDetailLeft'
import CategoryIndicatorDetailRight from './CategoryIndicatorDetailRight'

const CategoryIndicatorDetail = ({ rubricCategorySlug, categoryIndicatorSlug, locale }) => {
  const { loading, error, data: categoryIndicatorData, refetch } = useQuery(CATEGORY_INDICATOR_QUERY, {
    variables: { slug: categoryIndicatorSlug },
    context: { headers: { 'Accept-Language': locale } }
  })

  const { data: rubricCategoryData } = useQuery(RUBRIC_CATEGORY_QUERY, { variables: { slug: rubricCategorySlug } })

  const slugNameMapping = useMemo(
    () => ({
      [categoryIndicatorData?.categoryIndicator.slug]: categoryIndicatorData?.categoryIndicator.name,
      [rubricCategoryData?.rubricCategory.slug]: rubricCategoryData?.rubricCategory.name
    }),
    [categoryIndicatorData?.categoryIndicator, rubricCategoryData?.rubricCategory]
  )

  useEffect(() => {
    refetch()
  }, [refetch, locale])

  if (loading) {
    return <Loading />
  } else if (error && error.networkError) {
    return <Error />
  } else if (error && !error.networkError) {
    return <NotFound />
  }

  return (
    <div className='flex flex-col lg:flex-row pb-8'>
      <div className='lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full p-4'>
        <CategoryIndicatorDetailLeft categoryIndicator={categoryIndicatorData?.categoryIndicator} slugNameMapping={slugNameMapping} />
      </div>
      <div className='w-full lg:w-2/3 xl:w-3/4'>
        <CategoryIndicatorDetailRight categoryIndicator={categoryIndicatorData?.categoryIndicator} slugNameMapping={slugNameMapping} />
      </div>
    </div>
  )
}

export default CategoryIndicatorDetail
