import { useIntl } from 'react-intl'
import Breadcrumb from '../shared/breadcrumb'

const CategoryIndicatorDetailLeft = ({ categoryIndicator, slugNameMapping }) => {
  const { formatMessage } = useIntl()

  return (
    <>
      <div className='block lg:hidden'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='bg-white border-2 border-dial-gray lg:mr-6 shadow-lg'>
        <div className='flex flex-col p-4 text-dial-gray-dark'>
          <div className='font-semibold text-lg'>
            {categoryIndicator?.name}
          </div>
          <hr className='my-2' />
          <div className='text-sm'>
            <div>
              <span className='font-semibold'>
                {formatMessage({ id: 'categoryIndicator.weight' })}
              </span>
              : {categoryIndicator?.weight}
            </div>
            <div>
              <span className='font-semibold'>
                {formatMessage({ id: 'categoryIndicator.indicatorType' })}
              </span>
              : {categoryIndicator?.indicatorType}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CategoryIndicatorDetailLeft
