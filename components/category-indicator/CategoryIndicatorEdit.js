import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import Breadcrumb from '../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../shared/GraphQueryHandler'
import { CATEGORY_INDICATOR_QUERY } from '../shared/query/categoryIndicator'
import CategoryIndicatorEditLeft from './CategoryIndicatorEditLeft'
import CategoryIndicatorForm from './fragments/CategoryIndicatorForm'

const CategoryIndicatorEdit = ({ categorySlug, indicatorSlug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(CATEGORY_INDICATOR_QUERY, {
    variables: { indicatorSlug, categorySlug },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.EDITING
      }
    }
  })

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.categoryIndicator && !data?.rubricCategory) {
    return handleMissingData()
  }

  const { categoryIndicator, rubricCategory } = data

  const slugNameMapping = () => {
    const map = {
      edit: format('app.edit')
    }
    map[rubricCategory.slug] = rubricCategory.name
    map[categoryIndicator.slug] = categoryIndicator.name

    return map
  }

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-blue-chalk text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3 shrink-0'>
          <CategoryIndicatorEditLeft
            rubricCategory={rubricCategory}
            categoryIndicator={categoryIndicator}
          />
        </div>
        <div className='lg:basis-2/3'>
          <CategoryIndicatorForm
            rubricCategory={rubricCategory}
            categoryIndicator={categoryIndicator}
          />
        </div>
      </div>
    </div>
  )
}

export default CategoryIndicatorEdit
