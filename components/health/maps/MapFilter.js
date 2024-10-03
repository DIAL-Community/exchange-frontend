import { useIntl } from 'react-intl'
import { useCallback, useContext } from 'react'
import { MapFilterContext, MapFilterDispatchContext } from '../../context/MapFilterContext'
import { CountryAutocomplete } from '../../shared/filter/Country'
import { ProductAutocomplete } from '../../shared/filter/Product'

const MapFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    countries,
    products
  } = useContext(MapFilterContext)

  const {
    setCountries,
    setProducts
  } = useContext(MapFilterDispatchContext)

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
