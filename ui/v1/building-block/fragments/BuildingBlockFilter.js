import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { IoClose } from 'react-icons/io5'
import { BuildingBlockFilterContext, BuildingBlockFilterDispatchContext }
  from '../../../../components/context/BuildingBlockFilterContext'
import Checkbox from '../../shared/form/Checkbox'
import { SdgActiveFilters, SdgAutocomplete } from '../../shared/filter/Sdg'

const BuildingBlockFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { sdgs, showBeta, govStackOnly } = useContext(BuildingBlockFilterContext)
  const { setSDGs, setShowBeta, setShowGovStack } = useContext(BuildingBlockFilterDispatchContext)

  const toggleShowBeta = () => {
    setShowBeta(!showBeta)
  }

  const toggleShowGovStack = () => {
    setShowGovStack(!govStackOnly)
  }

  const clearFilter = (e) => {
    e.preventDefault()
    setSDGs([])
    setShowBeta(false)
    setShowGovStack(false)
  }

  const filteringBuildingBlock = () => {
    let count = 0
    count = showBeta ? count + 1 : count
    count = govStackOnly ? count + 1 : count
    count = count + sdgs.length

    return count > 0
  }

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      {filteringBuildingBlock() &&
        <div className='flex flex-col gap-y-3'>
          <div className='flex'>
            <div className='text-sm font-semibold text-dial-sapphire'>
              Filtered by:
            </div>
            <div className='ml-auto text-sm text-dial-stratos'>
              <button onClick={clearFilter}>Clear all</button>
            </div>
          </div>
          <div className='flex flex-row flex-wrap gap-1 text-sm'>
            <SdgActiveFilters sdgs={sdgs} setSdgs={setSDGs} />
            {showBeta && (
              <div className='bg-dial-slate-400 px-2 py-1 rounded'>
                <div className='flex flex-row gap-1'>
                  <div className='flex gap-x-1'>
                    {format('ui.buildingBlock.filter.showDraft')}
                    <button onClick={toggleShowBeta}>
                      <IoClose size='1rem' />
                    </button>
                  </div>
                </div>
              </div>
            )}
            {govStackOnly && (
              <div className='bg-dial-slate-400 px-2 py-1 rounded'>
                <div className='flex flex-row gap-1'>
                  <div className='flex gap-x-1'>
                    {format('ui.buildingBlock.filter.govStackOnly')}
                    <button onClick={toggleShowGovStack}>
                      <IoClose size='1rem' />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      }
      <div className='flex flex-col gap-y-4'>
        <div className='text-sm font-semibold text-dial-sapphire'>
          Filter your results by:
        </div>
        <hr className='bg-slate-200'/>
        <SdgAutocomplete sdgs={sdgs} setSdgs={setSDGs} />
        <hr className='bg-slate-200'/>
      </div>
      <div className='flex flex-col gap-y-4'>
        <div className='text-sm font-semibold text-dial-sapphire'>
          Refine with use case filters:
        </div>
        <label className='flex pl-4'>
          <Checkbox onChange={toggleShowBeta} value={showBeta} />
          <span className='mx-2 my-auto text-sm'>
            {format('ui.buildingBlock.filter.showDraft')}
          </span>
        </label>
        <label className='flex pl-4'>
          <Checkbox onChange={toggleShowGovStack} value={govStackOnly} />
          <span className='mx-2 my-auto text-sm'>
            {format('ui.buildingBlock.filter.govStackOnly')}
          </span>
        </label>
      </div>
    </div>
  )
}

export default BuildingBlockFilter
