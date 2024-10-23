import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import Breadcrumb from '../shared/Breadcrumb'
import { handleMissingData, handleQueryError } from '../shared/GraphQueryHandler'
import { RUBRIC_CATEGORY_QUERY } from '../shared/query/categoryIndicator'
import CategoryIndicatorForm from './fragments/CategoryIndicatorForm'
import CategoryIndicatorSimpleLeft from './fragments/CategoryIndicatorSimpleLeft'

const CategoryIndicatorCreate = ({ categorySlug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(RUBRIC_CATEGORY_QUERY, {
    variables: { categorySlug },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.CREATING
      }
    }
  })

  if (loading) {
    return handleMissingData()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.rubricCategory) {
    return handleMissingData()
  }

  const { rubricCategory } = data

  const slugNameMapping = (() => {
    const map = {
      create: format('app.create')
    }

    map[rubricCategory.slug] = rubricCategory.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <CategoryIndicatorSimpleLeft rubricCategory={rubricCategory} />
        </div>
        <div className='lg:basis-2/3'>
          <CategoryIndicatorForm rubricCategory={rubricCategory} />
        </div>
      </div>
    </div>
  )
}

export default CategoryIndicatorCreate
