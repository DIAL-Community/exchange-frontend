import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { RUBRIC_CATEGORY_QUERY } from '../shared/query/rubricCategory'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import RubricCategoryForm from './fragments/RubricCategoryForm'
import RubricCategoryEditLeft from './RubricCategoryEditLeft'

const RubricCategoryEdit = ({ categorySlug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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
    const map = {
      edit: format('app.edit')
    }
    map[rubricCategory.slug] = rubricCategory.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-blue-chalk text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <RubricCategoryEditLeft rubricCategory={rubricCategory} />
        </div>
        <div className='lg:basis-2/3'>
          <RubricCategoryForm rubricCategory={rubricCategory} />
        </div>
      </div>
    </div>
  )
}

export default RubricCategoryEdit
