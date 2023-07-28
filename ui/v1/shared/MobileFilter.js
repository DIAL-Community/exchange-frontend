import { useCallback, useState } from 'react'
import { FaSliders } from 'react-icons/fa6'
import { useIntl } from 'react-intl'

const MobileFilter = ({ iconColor, bgColor, entityFilter, onRibbon = true }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [startFiltering, setStartFiltering] = useState(false)

  const toggleFiltering = () => setStartFiltering(!startFiltering)
  const mobileFilterStyle = onRibbon
    ? 'block lg:hidden absolute top-6 right-8'
    : 'hidden lg:block xl:hidden relative'

  const layerStyle = onRibbon ? {} : { width: 'calc(100% - 4rem)' }
  const layerClassname = onRibbon ? 'top-[6rem] w-full' : 'top-[19rem] left-8'

  return (
    <>
      <div className={mobileFilterStyle}>
        <button onClick={toggleFiltering} className='my-auto h-full'>
          <FaSliders className={`text-2xl ${iconColor} mx-auto`} />
        </button>
      </div>
      {startFiltering &&
        <div
          className={`absolute ${layerClassname} ${bgColor} z-[10]`}
          style={layerStyle}
        >
          <div className='px-6 py-3 flex flex-col'>
            {entityFilter}
            <div className='ml-auto text-sm text-dial-sapphire'>
              <button
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
