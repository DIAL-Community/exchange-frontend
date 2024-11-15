import { useCallback, useState } from 'react'
import classNames from 'classnames'
import { FaSliders } from 'react-icons/fa6'
import { useIntl } from 'react-intl'

const MobileFilter = ({ iconColor, bgColor, entityFilter }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [startFiltering, setStartFiltering] = useState(false)

  const toggleFiltering = () => setStartFiltering(!startFiltering)
  const mobileFilterStyle = 'block md:hidden relative'

  const layerStyle = {
    top: `
      calc(var(--header-height)
      + var(--ribbon-inner-height)
      + var(--tab-height))
      + var(--spacer-padding)
      + var(--spacer-padding)
    `,
    width: 'calc(100% - var(--search-bar-padding))'
  }

  return (
    <>
      <div className={mobileFilterStyle}>
        <button type='button' onClick={toggleFiltering} className='my-auto h-full'>
          <FaSliders className={`text-2xl ${iconColor} mx-auto`} />
        </button>
      </div>
      {startFiltering &&
        <div
          className={classNames(
            `absolute border-2 ${bgColor} z-[10]`
          )}
          style={layerStyle}
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
