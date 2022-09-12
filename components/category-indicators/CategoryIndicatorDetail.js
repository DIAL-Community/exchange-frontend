import { useQuery } from '@apollo/client'
import { useEffect, useMemo } from 'react'
import NotFound from '../shared/NotFound'
import { Error, Loading } from '../shared/FetchStatus'
import { CATEGORY_INDICATOR_QUERY } from '../../queries/category-indicator'
import CategoryIndicatorDetailLeft from './CategoryIndicatorDetailLeft'
import CategoryIndicatorDetailRight from './CategoryIndicatorDetailRight'

const CategoryIndicatorDetail = ({ slug, locale }) => {
  const { loading, error, data, refetch } = useQuery(CATEGORY_INDICATOR_QUERY, {
    variables: { slug },
    context: { headers: { 'Accept-Language': locale } }
  })

  const slugNameMapping = useMemo(() => ({ [data?.categoryIndicator.slug]: data?.categoryIndicator.name }), [data?.categoryIndicator])

  useEffect(refetch, [refetch, locale])

  if (loading) {
    return <Loading />
  } else if (error && error.networkError) {
    return <Error />
  } else if (error && !error.networkError) {
    return <NotFound />
  }

  return (
    <div className='flex flex-col lg:flex-row pb-8 max-w-catalog mx-auto'>
      <div className='lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full p-4'>
        <CategoryIndicatorDetailLeft categoryIndicator={data?.categoryIndicator} slugNameMapping={slugNameMapping} />
      </div>
      <div className='w-full lg:w-2/3 xl:w-3/4'>
        <CategoryIndicatorDetailRight categoryIndicator={data?.categoryIndicator} slugNameMapping={slugNameMapping} />
      </div>
    </div>
  )
}

export default CategoryIndicatorDetail
