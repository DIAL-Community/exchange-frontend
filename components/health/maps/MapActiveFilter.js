import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { FilterContext, FilterDispatchContext } from '../../context/FilterContext'
import { CountryActiveFilters } from '../../shared/filter/Country'
import { ProductActiveFilters } from '../../shared/filter/Product'

const MapActiveFilter = () => {

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    countries, products
  } = useContext(FilterContext)

  const {
    setCountries, setProducts
  } = useContext(FilterDispatchContext)

  const filteringMap = () => {
    return countries.length + products.length > 0
  }

  const clearFilter = (e) => {
    e.preventDefault()
    setCountries([])
    setProducts([])
  }

  return (
    <>
      {filteringMap() &&
        <div className='flex flex-col gap-y-3 py-3'>
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
            <CountryActiveFilters {...{ countries, setCountries }} />
            <ProductActiveFilters {...{ products, setProducts }} />
          </div>
        </div>
      }
    </>
  )
}

export default MapActiveFilter
