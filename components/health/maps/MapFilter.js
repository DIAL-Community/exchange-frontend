import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { FilterContext, FilterDispatchContext } from '../../context/FilterContext'
import { CountryAutocomplete } from '../../shared/filter/Country'
import { ProductAutocomplete } from '../../shared/filter/Product'

const MapFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    countries,
    products
  } = useContext(FilterContext)

  const {
    setCountries,
    setProducts
  } = useContext(FilterDispatchContext)

  return (
    <div className='flex flex-col gap-y-2'>
      <div className='text-sm font-semibold text-dial-sapphire py-3'>
        {format('ui.filter.primary.title')}
      </div>
      <div className='flex flex-col gap-y-2'>
        <hr className='border-b border-dial-slate-200' />
        <CountryAutocomplete {...{ countries, setCountries }} />
        <hr className='border-b border-dial-slate-200' />
        <ProductAutocomplete {...{ products, setProducts }} />
        <hr className='border-b border-dial-slate-200' />
      </div>
    </div>
  )
}

export default MapFilter
