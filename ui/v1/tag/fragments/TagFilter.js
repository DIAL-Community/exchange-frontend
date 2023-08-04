import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const TagFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const clearFilter = (e) => {
    e.preventDefault()
  }

  const filteringTag = () => {
    return false
  }

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      {filteringTag() &&
        <div className='flex flex-col gap-y-3'>
          <div className='flex'>
            <div className='text-sm font-semibold text-dial-sapphire'>
              {format('ui.filter.filteredBy')}
            </div>
            <div className='ml-auto text-sm text-dial-stratos'>
              <button onClick={clearFilter}>
                {format('ui.filter.clearAll')}
              </button>
            </div>
          </div>
        </div>
      }
      <div className='flex flex-col gap-y-2'>
        <div className='text-sm font-semibold text-dial-sapphire'>
          {format('ui.filter.primary.title')}
        </div>
      </div>
    </div>
  )
}

export default TagFilter
