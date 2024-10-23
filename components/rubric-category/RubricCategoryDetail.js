import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import Breadcrumb from '../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../shared/GraphQueryHandler'
import { RUBRIC_CATEGORY_QUERY } from '../shared/query/rubricCategory'
import RubricCategoryDetailLeft from './RubricCategoryDetailLeft'
import RubricCategoryDetailRight from './RubricCategoryDetailRight'

const RubricCategoryDetail = ({ categorySlug }) => {
  const scrollRef = useRef(null)

  const { loading, error, data } = useQuery(RUBRIC_CATEGORY_QUERY, {
    variables: { slug: categorySlug },
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
  } else if (!data?.rubricCategory) {
    return handleMissingData()
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
