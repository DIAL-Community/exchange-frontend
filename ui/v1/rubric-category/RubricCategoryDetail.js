import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { RUBRIC_CATEGORY_QUERY } from '../shared/query/rubricCategory'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import RubricCategoryDetailRight from './RubricCategoryDetailRight'
import RubricCategoryDetailLeft from './RubricCategoryDetailLeft'

const RubricCategoryDetail = ({ categorySlug }) => {
  const scrollRef = useRef(null)

  const { loading, error, data } = useQuery(RUBRIC_CATEGORY_QUERY, {
    variables: { slug: categorySlug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.rubricCategory) {
    return <NotFound />
  }

  const { rubricCategory } = data

  const slugNameMapping = (() => {
    const map = {}
    map[rubricCategory.slug] = rubricCategory.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <RubricCategoryDetailLeft scrollRef={scrollRef} rubricCategory={rubricCategory} />
        </div>
        <div className='lg:basis-2/3'>
          <RubricCategoryDetailRight ref={scrollRef} rubricCategory={rubricCategory} />
        </div>
      </div>
    </div>
  )
}

export default RubricCategoryDetail
