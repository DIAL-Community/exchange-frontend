import debounce from 'lodash.debounce'
import React, { useCallback, useEffect, useRef } from 'react'
import { useIntl } from 'react-intl'
import ReactTooltip from 'react-tooltip'

const HorizontalItemList = ({ restTooltipMessage, children }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const containerRef = useRef()
  const [isListOverflowing, setIsListOverflowing] = React.useState(false)

  const getContainerSize = useCallback(() => {
    const container = containerRef.current
    if (container) {
      setIsListOverflowing(container.offsetHeight < container.scrollHeight)
    }
  }, [])

  useEffect(() => {
    getContainerSize()
    window.addEventListener('resize', debounce(getContainerSize, 200))
  }, [getContainerSize])

  useEffect(() => ReactTooltip.rebuild, [])

  return (
    <div className='flex flex-row' data-testid='horizontal-items-list'>
      <div
        className='flex flex-row flex-wrap overflow-hidden max-h-8 gap-1'
        ref={containerRef}
      >
        {children?.length > 0 ? children : (
          <div className='bg-white p-2 rounded' data-testid='items-not-applicable'>
            {format('general.na')}
          </div>
        )}
      </div>
      {isListOverflowing && (
        <div className='bg-white px-2 ml-2 py-0.5 rounded h-full' data-testid='items-rest-marker'>
          <span
            className='font-semibold bg-white'
            data-tip={restTooltipMessage}
          >
            &hellip;
          </span>
        </div>
      )}
    </div>
  )
}

export default HorizontalItemList
