import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const RubricCategoryDetailHeader = ({ rubricCategory }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='text-xl text-dial-plum font-semibold'>
        {rubricCategory.name}
      </div>
      <div className='flex justify-center items-center py-20 bg-white rounded border'>
        <div className='inline'>
          <img
            src='/ui/v1/rubric-category-header.svg'
            alt={format('ui.image.logoAlt', { name: format('ui.rubricCategory.label') })}
            className='object-contain w-16 h-16'
          />
        </div>
      </div>
    </div>
  )
}

export default RubricCategoryDetailHeader
