import { useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { MapFilterContext, MapFilterDispatchContext } from '../context/MapFilterContext'
import { CapabilityAutocomplete } from '../shared/filter/Capability'
import { EndorsingYearSelect } from '../shared/filter/EndorsingYear'
import { OperatorAutocomplete } from '../shared/filter/Operator'
import { OrganizationAutocomplete } from '../shared/filter/Organization'
import { ProductAutocomplete } from '../shared/filter/Product'
import { SectorAutocomplete } from '../shared/filter/Sector'
import { TagAutocomplete } from '../shared/filter/Tag'

const MapFilter = () => {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    aggregators,
    operators,
    services,
    years,
    sectors,
    products,
    tags
  } = useContext(MapFilterContext)

  const {
    setAggregators,
    setOperators,
    setServices,
    setYears,
    setSectors,
    setProducts,
    setTags
  } = useContext(MapFilterDispatchContext)

  const routeContains = (expectedText) => router.pathname.indexOf(expectedText) >= 0

  return (
    <div className='flex flex-col gap-y-2'>
      <div className='text-sm font-semibold text-dial-sapphire py-3'>
        {format('ui.filter.primary.title')}
      </div>
      {routeContains('projects') && (
        <div className='flex flex-col gap-y-2'>
          <hr className='border-b border-dial-slate-200' />
          <SectorAutocomplete {...{ sectors, setSectors }} />
          <hr className='border-b border-dial-slate-200' />
          <TagAutocomplete {...{ tags, setTags }} />
          <hr className='border-b border-dial-slate-200' />
          <ProductAutocomplete {...{ products, setProducts }} />
          <hr className='border-b border-dial-slate-200' />
        </div>
      )}
      {routeContains('endorsers') && (
        <div className='flex flex-col gap-y-2'>
          <hr className='border-b border-dial-slate-200' />
          <SectorAutocomplete sectors={sectors} setSectors={setSectors} />
          <hr className='border-b border-dial-slate-200' />
          <EndorsingYearSelect {...{ years, setYears }} />
          <hr className='border-b border-dial-slate-200' />
        </div>
      )}
      {routeContains('aggregators') && (
        <div className='flex flex-col gap-y-2'>
          <hr className='border-b border-dial-slate-200' />
          <OrganizationAutocomplete
            aggregatorOnly
            organizations={aggregators}
            setOrganizations={setAggregators}
          />
          <hr className='border-b border-dial-slate-200' />
          <OperatorAutocomplete operators={operators} setOperators={setOperators} />
          <hr className='border-b border-dial-slate-200' />
          <CapabilityAutocomplete services={services} setServices={setServices} />
          <hr className='border-b border-dial-slate-200' />
        </div>
      )}
    </div>
  )
}

export default MapFilter
