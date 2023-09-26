import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { CATEGORY_INDICATOR_QUERY } from '../shared/query/categoryIndicator'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import CategoryIndicatorForm from './fragments/CategoryIndicatorForm'
import CategoryIndicatorEditLeft from './CategoryIndicatorEditLeft'

const CategoryIndicatorEdit = ({ categorySlug, indicatorSlug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(CATEGORY_INDICATOR_QUERY, {
    variables: { indicatorSlug, categorySlug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.categoryIndicator && !data?.rubricCategory) {
    return <NotFound />
  }

  const { categoryIndicator, rubricCategory } = data

  const slugNameMapping = (() => {
    const map = {
      edit: format('app.edit')
    }
    map[rubricCategory.slug] = rubricCategory.name
    map[categoryIndicator.slug] = categoryIndicator.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-blue-chalk text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
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
