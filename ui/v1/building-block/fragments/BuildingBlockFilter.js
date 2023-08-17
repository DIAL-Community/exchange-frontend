import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { IoClose } from 'react-icons/io5'
import { BuildingBlockFilterContext, BuildingBlockFilterDispatchContext }
  from '../../../../components/context/BuildingBlockFilterContext'
import { SdgActiveFilters, SdgAutocomplete } from '../../shared/filter/Sdg'
import { UseCaseActiveFilters, UseCaseAutocomplete } from '../../shared/filter/UseCase'
import { WorkflowActiveFilters, WorkflowAutocomplete } from '../../shared/filter/Workflow'
import { CategoryTypeActiveFilters, CategoryTypeAutocomplete } from '../../shared/filter/CategoryType'
import Checkbox from '../../shared/form/Checkbox'

const BuildingBlockFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { sdgs, useCases, workflows, categoryTypes, showMature } = useContext(BuildingBlockFilterContext)
  const { setSdgs, setUseCases, setWorkflows, setCategoryTypes, setShowMature }
    = useContext(BuildingBlockFilterDispatchContext)

  const clearFilter = (e) => {
    e.preventDefault()
    setSdgs([])
    setUseCases([])
    setWorkflows([])
    setCategoryTypes([])
    setShowMature(false)
  }

  const toggleShowMature = () => setShowMature(!showMature)

  const filteringBuildingBlock = () => {
    let count = showMature ? 1 : 0
    count = count + sdgs.length + useCases.length + workflows.length + categoryTypes.length > 0

    return count > 0
  }

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      {filteringBuildingBlock() &&
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
          <div className='flex flex-row flex-wrap gap-1 text-sm'>
            <SdgActiveFilters sdgs={sdgs} setSdgs={setSdgs} />
            <UseCaseActiveFilters useCases={useCases} setUseCases={setUseCases} />
            <WorkflowActiveFilters workflows={workflows} setWorkflows={setWorkflows} />
            <CategoryTypeActiveFilters categoryTypes={categoryTypes} setCategoryTypes={setCategoryTypes} />
            {showMature && (
              <div className='bg-dial-slate-400 px-2 py-1 rounded'>
                <div className='flex flex-row gap-1'>
                  <div className='flex gap-x-1'>
                    {format('ui.buildingBlock.filter.showMature')}
                    <button onClick={toggleShowMature}>
                      <IoClose size='1rem' />
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
          {format('ui.filter.primary.title')}
        </div>
        <hr className='border-b border-dial-slate-200'/>
        <SdgAutocomplete sdgs={sdgs} setSdgs={setSdgs} />
        <hr className='border-b border-dial-slate-200'/>
        <UseCaseAutocomplete useCases={useCases} setUseCases={setUseCases} />
        <hr className='border-b border-dial-slate-200'/>
        <WorkflowAutocomplete workflows={workflows} setWorkflows={setWorkflows} />
        <hr className='border-b border-dial-slate-200'/>
      </div>
      <div className='flex flex-col gap-y-2'>
        <div className='text-sm font-semibold text-dial-sapphire'>
          {format('ui.filter.secondary.title', { entity: format('ui.buildingBlock.label').toLowerCase() })}:
        </div>
        <CategoryTypeAutocomplete categoryTypes={categoryTypes} setCategoryTypes={setCategoryTypes} />
        <hr className='border-b border-dial-slate-200'/>
        <label className='flex pl-4 py-2'>
          <Checkbox onChange={toggleShowMature} value={showMature} />
          <span className='mx-2 my-auto text-sm'>
            {format('ui.buildingBlock.filter.showMature')}
          </span>
        </label>
      </div>
    </div>
  )
}

export default BuildingBlockFilter
