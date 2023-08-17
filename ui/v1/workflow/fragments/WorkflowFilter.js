import { useCallback } from 'react'
import { useIntl } from 'react-intl'

const WorkflowFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const clearFilter = (e) => {
    e.preventDefault()
  }

  const filteringWorkflow = () => {
    return false
  }

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      {filteringWorkflow() &&
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
        <hr className='border-b border-dial-slate-200'/>
      </div>
    </div>
  )
}

export default WorkflowFilter
