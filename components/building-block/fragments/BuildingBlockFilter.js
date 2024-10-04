import { useCallback, useContext } from 'react'
import { FaXmark } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { FilterContext, FilterDispatchContext } from '../../context/FilterContext'
import { CategoryTypeActiveFilters, CategoryTypeAutocomplete } from '../../shared/filter/CategoryType'
import { SdgActiveFilters, SdgAutocomplete } from '../../shared/filter/Sdg'
import { UseCaseActiveFilters, UseCaseAutocomplete } from '../../shared/filter/UseCase'
import { WorkflowActiveFilters, WorkflowAutocomplete } from '../../shared/filter/Workflow'
import Checkbox from '../../shared/form/Checkbox'

const BuildingBlockFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    sdgs,
    useCases,
    workflows,
    categoryTypes,
    showMature,
    showGovStackOnly
  } = useContext(FilterContext)

  const {
    setSdgs,
    setUseCases,
    setWorkflows,
    setCategoryTypes,
    setShowMature,
    setShowGovStackOnly
  } = useContext(FilterDispatchContext)

  const clearFilter = () => {
    setSdgs([])
    setUseCases([])
    setWorkflows([])
    setCategoryTypes([])
    setShowMature(false)
    setShowGovStackOnly(false)
  }

  const toggleShowMature = () => setShowMature(!showMature)

  const toggleShowGovStackOnly = () => {
    setShowGovStackOnly(!showGovStackOnly)
  }

  const filteringBuildingBlock = () => {
    let count = 0
    count = count + showMature ? 1 : 0
    count = count + showGovStackOnly ? 1 : 0
    count = count + sdgs.length + useCases.length + workflows.length + categoryTypes.length

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
              <button type='button' className='' onClick={clearFilter}>
                <span className='text-dial-sapphire'>
                  {format('ui.filter.clearAll')}
                </span>
              </button>
            </div>
          </div>
          <div className='flex flex-row flex-wrap gap-1 text-sm'>
            <SdgActiveFilters sdgs={sdgs} setSdgs={setSdgs} />
            <UseCaseActiveFilters useCases={useCases} setUseCases={setUseCases} />
            <WorkflowActiveFilters workflows={workflows} setWorkflows={setWorkflows} />
            <CategoryTypeActiveFilters categoryTypes={categoryTypes} setCategoryTypes={setCategoryTypes} />
            {showMature && (
              <div className='bg-dial-slate-400 text-white px-2 py-1 rounded'>
                <div className='flex flex-row gap-1'>
                  <div className='flex gap-x-1'>
                    {format('ui.buildingBlock.filter.showMature')}
                    <button type='button' onClick={toggleShowMature}>
                      <FaXmark size='1rem' />
                    </button>
                  </div>
                </div>
              </div>
            )}
            {showGovStackOnly && (
              <div className='bg-dial-slate-400 text-white px-2 py-1 rounded'>
                <div className='flex flex-row gap-1'>
                  <div className='flex gap-x-1'>
                    {format('ui.buildingBlock.filter.showGovStackOnly')}
                    <button type='button' onClick={toggleShowGovStackOnly}>
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
        <label className='flex py-2'>
          <Checkbox onChange={toggleShowMature} value={showMature} />
          <span className='mx-2 my-auto text-sm'>
            {format('ui.buildingBlock.filter.showMature')}
          </span>
        </label>
        <label className='flex py-2'>
          <Checkbox onChange={toggleShowGovStackOnly} value={showGovStackOnly} />
          <span className='mx-2 my-auto text-sm'>
            {format('ui.buildingBlock.filter.showGovStackOnly')}
          </span>
        </label>
      </div>
    </div>
  )
}

export default BuildingBlockFilter
