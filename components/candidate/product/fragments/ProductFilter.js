import { useCallback, useContext } from 'react'
import { FaXmark } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { FilterContext, FilterDispatchContext } from '../../../context/FilterContext'
import Checkbox from '../../../shared/form/Checkbox'

const ProductFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { currentUserOnly } = useContext(FilterContext)
  const { setCurrentUserOnly } = useContext(FilterDispatchContext)

  const toggleCurrentUserOnly = () => {
    setCurrentUserOnly(!currentUserOnly)
  }

  const clearFilter = () => {
    setCurrentUserOnly(false)
  }

  const filteringProduct = () => {
    return currentUserOnly ? 1 : 0 > 0
  }

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      {filteringProduct() &&
        <div className='flex flex-col gap-y-3'>
          <div className='flex'>
            <div className='text-sm font-semibold text-dial-sapphire'>
              {format('ui.filter.filteredBy')}
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
            {currentUserOnly && (
              <div className='bg-dial-slate-400 px-2 py-1 rounded text-white'>
                <div className='flex flex-row gap-1'>
                  <div className='flex gap-x-1'>
                    {format('ui.product.filter.currentUserOnly')}
                    <button type='button' onClick={toggleCurrentUserOnly}>
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
        <label className='flex py-2'>
          <Checkbox value={currentUserOnly} onChange={toggleCurrentUserOnly} />
          <span className='mx-2 my-auto text-sm'>
            {format('ui.product.filter.currentUserOnly')}
          </span>
        </label>
        <hr className='border-b border-dial-slate-200' />
      </div>
    </div>
  )
}

export default ProductFilter
