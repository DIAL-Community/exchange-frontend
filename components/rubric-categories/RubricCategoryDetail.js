import { useQuery } from '@apollo/client'
import { useEffect, useMemo } from 'react'
import NotFound from '../shared/NotFound'
import { Error, Loading } from '../shared/FetchStatus'
import { RUBRIC_CATEGORY_QUERY } from '../../queries/rubric-category'
import RubricCategoryDetailLeft from './RubricCategoryDetailLeft'
import RubricCategoryDetailRight from './RubricCategoryDetailRight'

const RubricCategoryDetail = ({ slug, locale }) => {
  const { loading, error, data, refetch } = useQuery(RUBRIC_CATEGORY_QUERY, {
    variables: { slug },
    context: { headers: { 'Accept-Language': locale } }
  })

  useEffect(
    () => { refetch() },
    [refetch, locale]
  )

  const slugNameMapping = useMemo(() => {
    return data?.rubricCategory ? { [data?.rubricCategory.slug]: data?.rubricCategory.name } : {}
  }, [data])

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.rubricCategory) {
    return <NotFound />
  }

  return (
    <div className='flex flex-col lg:flex-row pb-8'>
      <div className='lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full p-4'>
        <RubricCategoryDetailLeft rubricCategory={data?.rubricCategory} slugNameMapping={slugNameMapping} />
      </div>
      <div className='w-full lg:w-2/3 xl:w-3/4'>
        <RubricCategoryDetailRight rubricCategory={data?.rubricCategory} slugNameMapping={slugNameMapping} />
      </div>
    </div>
  )
}

export default RubricCategoryDetail
