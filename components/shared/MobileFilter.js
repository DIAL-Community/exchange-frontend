import { useCallback, useState } from 'react'
import { BiSlider } from 'react-icons/bi'
import { useIntl } from 'react-intl'

const MobileFilter = ({ bgColor, entityFilter }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [startFiltering, setStartFiltering] = useState(false)

  const toggleFiltering = () => setStartFiltering(!startFiltering)
  const mobileFilterStyle = 'block md:hidden'

  return (
    <>
      <div className={`${mobileFilterStyle} h-full`}>
        <button type='button' onClick={toggleFiltering} className='mt-[0.5rem]'>
          <BiSlider  className='text-2xl text-dial-slate-500 mx-auto' />
        </button>
      </div>
      {startFiltering &&
        <div
          className={`absolute border-2 ${bgColor} z-[10] w-full top-0`}
        >
          <div className='px-6 py-3 flex flex-col'>
            {entityFilter}
            <div className='ml-auto text-sm text-dial-sapphire pb-3'>
              <button
                type='button'
                onClick={toggleFiltering}
                className='submit-button'
              >
                {format('app.close')}
              </button>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default MobileFilter
