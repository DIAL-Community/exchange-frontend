import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Breadcrumb from '../shared/breadcrumb'
import { HtmlViewer } from '../shared/HtmlViewer'
import RubricCategoryDetailCategoryIndicators from './RubricCategoryDetailCategoryIndicators'

const RubricCategoryDetailRight = ({ rubricCategory, slugNameMapping }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id) => formatMessage({ id }), [formatMessage])

  return (
    <div className='px-4'>
      <div className='hidden lg:block'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='card-title mb-3 text-dial-gray-dark'>{format('product.description')}</div>
      <HtmlViewer
        initialContent={rubricCategory?.rubricCategoryDescription?.description}
        editorId='rubric-category-detail'
      />
      {rubricCategory?.categoryIndicators &&
        <RubricCategoryDetailCategoryIndicators
          categoryIndicators={rubricCategory.categoryIndicators}
          rubricCategorySlug={rubricCategory.slug}
        />
      }
    </div>
  )
}

export default RubricCategoryDetailRight
