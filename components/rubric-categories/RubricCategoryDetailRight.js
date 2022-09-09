import parse from 'html-react-parser'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Breadcrumb from '../shared/breadcrumb'

const RubricCategoryDetailRight = ({ rubricCategory, slugNameMapping }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id) => formatMessage({ id }), [formatMessage])

  return (
    <div className='px-4'>
      <div className='hidden lg:block'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='mt-8 card-title mb-3 text-dial-gray-dark'>{format('product.description')}</div>
      <div className='fr-view text-dial-gray-dark'>
        {rubricCategory?.rubricCategoryDescription && parse(rubricCategory.rubricCategoryDescription.description)}
      </div>
    </div>
  )
}

export default RubricCategoryDetailRight
