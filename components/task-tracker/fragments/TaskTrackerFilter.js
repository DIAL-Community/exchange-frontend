import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { FaXmark } from 'react-icons/fa6'
import { FilterContext } from '../../context/FilterContext'
import Checkbox from '../../shared/form/Checkbox'

const TaskTrackerFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { showFailedOnly } = useContext(FilterContext)
  const { setShowFailedOnly } = useContext(FilterContext)

  const toggleShowFailedOnly = () => {
    setShowFailedOnly(!showFailedOnly)
  }

  const clearFilter = (e) => {
    e.preventDefault()
    setShowFailedOnly(false)
  }

  const filteringUseCase = () => {
    return showFailedOnly
  }

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      {filteringUseCase() &&
        <div className='flex flex-col gap-y-3'>
          <div className='flex'>
            <div className='text-sm font-semibold text-dial-sapphire'>
              {format('ui.filter.filteredBy')}:
            </div>
            <div className='ml-auto text-sm text-dial-stratos'>
              <button type='button' onClick={clearFilter}>
                <span className='text-dial-sapphire'>
                  {format('ui.filter.clearAll')}
                </span>
              </button>
            </div>
          </div>
          <div className='flex flex-row flex-wrap gap-1 text-sm'>
            {showFailedOnly && (
              <div className='bg-dial-slate-400 text-white px-2 py-1 rounded'>
                <div className='flex flex-row gap-1'>
                  <div className='flex gap-x-1'>
                    {format('ui.taskTracker.filter.showFailedOnly')}
                    <button type='button' onClick={toggleShowFailedOnly}>
                      <FaXmark size='1rem' />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      }
      <div className='flex flex-col gap-y-2'>
        <div className='text-sm font-semibold text-dial-sapphire'>
          {format('ui.filter.primary.title')}:
        </div>
        <hr className='border-b border-dial-slate-200'/>
        <label className='flex py-2'>
          <Checkbox onChange={toggleShowFailedOnly} value={showFailedOnly} />
          <span className='mx-2 my-auto text-sm'>
            {format('ui.taskTracker.filter.showFailedOnly')}
          </span>
        </label>
        <hr className='border-b border-dial-slate-200'/>
      </div>
    </div>
  )
}

export default TaskTrackerFilter
