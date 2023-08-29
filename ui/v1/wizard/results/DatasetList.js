import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const DatasetList = ({ headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-4' ref={headerRef}>
      <div className='text-xl font-semibold text-dial-meadow'>
        {format('ui.dataset.header')}
      </div>
    </div>
  )
}

export default DatasetList
