import { useIntl } from 'react-intl'
import { useCallback, useContext } from 'react'
import {
  WorkflowFilterContext,
  WorkflowFilterDispatchContext
} from '../../context/WorkflowFilterContext'
import { SdgActiveFilters, SdgAutocomplete } from '../../shared/filter/Sdg'
import { UseCaseActiveFilters, UseCaseAutocomplete } from '../../shared/filter/UseCase'

const WorkflowFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { sdgs, useCases } = useContext(WorkflowFilterContext)
  const { setSdgs, setUseCases } = useContext(WorkflowFilterDispatchContext)

  const clearFilter = (e) => {
    e.preventDefault()
    setSdgs([])
    setUseCases([])
  }

  const filteringWorkflow = () => {
    let count = 0
    count = count + sdgs.length
    count = count + useCases.length

    return count > 0
  }

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      {filteringWorkflow() &&
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
            <SdgActiveFilters sdgs={sdgs} setSdgs={setSdgs} />
            <UseCaseActiveFilters useCases={useCases} setUseCases={setUseCases} />
          </div>
        </div>
      }
      <div className='flex flex-col gap-y-2'>
        <div className='text-sm font-semibold text-dial-sapphire'>
          {format('ui.filter.primary.title')}:
        </div>
        <hr className='border-b border-dial-slate-200'/>
        <SdgAutocomplete sdgs={sdgs} setSdgs={setSdgs} />
        <hr className='border-b border-dial-slate-200'/>
        <UseCaseAutocomplete useCases={useCases} setUseCases={setUseCases} />
        <hr className='border-b border-dial-slate-200'/>
      </div>
    </div>
  )
}

export default WorkflowFilter
