import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { FaXmark } from 'react-icons/fa6'
import {
  UseCaseFilterContext,
  UseCaseFilterDispatchContext
} from '../../context/UseCaseFilterContext'
import Checkbox from '../../shared/form/Checkbox'
import { SdgActiveFilters, SdgAutocomplete } from '../../shared/filter/Sdg'

const UseCaseFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { sdgs, showBeta, govStackOnly } = useContext(UseCaseFilterContext)
  const { setSdgs, setShowBeta, setShowGovStack } = useContext(UseCaseFilterDispatchContext)

  const toggleShowBeta = () => {
    setShowBeta(!showBeta)
  }

  const toggleShowGovStack = () => {
    setShowGovStack(!govStackOnly)
  }

  const clearFilter = (e) => {
    e.preventDefault()
    setSdgs([])
    setShowBeta(false)
    setShowGovStack(false)
  }

  const filteringUseCase = () => {
    let count = 0
    count = showBeta ? count + 1 : count
    count = govStackOnly ? count + 1 : count
    count = count + sdgs.length

    return count > 0
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
            <SdgActiveFilters sdgs={sdgs} setSdgs={setSdgs} />
            {showBeta && (
              <div className='bg-dial-slate-400 text-white px-2 py-1 rounded'>
                <div className='flex flex-row gap-1'>
                  <div className='flex gap-x-1'>
                    {format('ui.useCase.filter.showDraft')}
                    <button type='button' onClick={toggleShowBeta}>
                      <FaXmark size='1rem' />
                    </button>
                  </div>
                </div>
              </div>
            )}
            {govStackOnly && (
              <div className='bg-dial-slate-400 text-white px-2 py-1 rounded'>
                <div className='flex flex-row gap-1'>
                  <div className='flex gap-x-1'>
                    {format('ui.useCase.filter.govStackOnly')}
                    <button type='button' onClick={toggleShowGovStack}>
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
        <SdgAutocomplete sdgs={sdgs} setSdgs={setSdgs} />
        <hr className='border-b border-dial-slate-200'/>
      </div>
      <div className='flex flex-col gap-y-2'>
        <div className='text-sm font-semibold text-dial-sapphire'>
          {format('ui.filter.secondary.title', { entity: format('ui.useCase.label').toLowerCase() })}:
        </div>
        <label className='flex py-2'>
          <Checkbox onChange={toggleShowBeta} value={showBeta} />
          <span className='mx-2 my-auto text-sm'>
            {format('ui.useCase.filter.showDraft')}
          </span>
        </label>
        <hr className='border-b border-dial-slate-200'/>
        <label className='flex py-2'>
          <Checkbox onChange={toggleShowGovStack} value={govStackOnly} />
          <span className='mx-2 my-auto text-sm'>
            {format('ui.useCase.filter.govStackOnly')}
          </span>
        </label>
      </div>
    </div>
  )
}

export default UseCaseFilter
