import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { OrganizationFilterContext, OrganizationFilterDispatchContext }
  from '../../../../components/context/OrganizationFilterContext'
import { SectorActiveFilters, SectorAutocomplete } from '../../shared/filter/Sector'

const OrganizationFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { sectors } = useContext(OrganizationFilterContext)
  const { setSectors } = useContext(OrganizationFilterDispatchContext)

  const clearFilter = (e) => {
    e.preventDefault()
    setSectors([])
  }

  const filteringOrganization = () => {
    return sectors.length > 0
  }

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      {filteringOrganization() &&
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
            <SectorActiveFilters sectors={sectors} setSectors={setSectors} />
          </div>
        </div>
      }
      <div className='flex flex-col gap-y-2'>
        <div className='text-sm font-semibold text-dial-sapphire'>
          {format('ui.filter.primary.title')}
        </div>
        <SectorAutocomplete sectors={sectors} setSectors={setSectors} />
        <hr className='bg-slate-200'/>
      </div>
    </div>
  )
}

export default OrganizationFilter