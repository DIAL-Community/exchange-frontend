import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Breadcrumb from '../shared/breadcrumb'

const RubricCategoryDetailLeft = ({ rubricCategory, slugNameMapping }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id) => formatMessage({ id }), [formatMessage])

  return (
    <>
      <div className='block lg:hidden'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='bg-white border-2 border-dial-gray lg:mr-6 shadow-lg'>
        <div className='flex flex-col p-4 text-dial-gray-dark'>
          <div className='font-semibold text-lg'>
            {rubricCategory?.name}
          </div>
          <hr className='my-2' />
          <div className='text-sm'>
            <span className='font-semibold'>
              {format('rubric-categories.weight')}
            </span>
            {`: ${rubricCategory?.weight}`}
          </div>
        </div>
      </div>
    </>
  )
}

export default RubricCategoryDetailLeft
