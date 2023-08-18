import { useRouter } from 'next/router'
import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { MapFilterContext, MapFilterDispatchContext } from '../../../components/context/MapFilterContext'
import { SectorActiveFilters } from '../shared/filter/Sector'
import { TagActiveFilters } from '../shared/filter/Tag'
import { ProductActiveFilters } from '../shared/filter/Product'
import { EndorsingYearActiveFilters } from '../shared/filter/EndorsingYear'
import { OrganizationActiveFilters } from '../shared/filter/Organization'
import { OperatorActiveFilters } from '../shared/filter/Operator'
import { CapabilityActiveFilters } from '../shared/filter/Capability'

const MapActiveFilter = () => {
  const router = useRouter()

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    aggregators, operators, services, orgSectors, years, sectors, products, tags
  } = useContext(MapFilterContext)

  const {
    setAggregators, setOperators, setServices, setOrgSectors, setYears, setSectors, setProducts, setTags
  } = useContext(MapFilterDispatchContext)

  const filteringMap = () => {
    if (router.pathname.indexOf('projects') >= 0) {
      return sectors.length + tags.length + products.length > 0
    } else if (router.pathname.indexOf('endorsers') >= 0) {
      return orgSectors.length + years.length > 0
    } else if (router.pathname.indexOf('aggregators') >= 0) {
      return aggregators.length + operators.length + services.length > 0
    }

    return false
  }

  const clearFilter = (e) => {
    e.preventDefault()
    if (router.pathname.indexOf('projects') >= 0) {
      setSectors([])
      setTags([])
      setProducts([])
    } else if (router.pathname.indexOf('endorsers') >= 0) {
      setOrgSectors([])
      setYears([])
    } else if (router.pathname.indexOf('aggregators') >= 0) {
      setAggregators([])
      setOperators([])
      setServices([])
    }
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
              <button onClick={clearFilter}>
                {format('ui.filter.clearAll')}
              </button>
            </div>
          </div>
          <div className='flex flex-row flex-wrap gap-1 text-sm'>
            {router.pathname.indexOf('projects') >= 0 &&
              <>
                <SectorActiveFilters {...{ sectors, setSectors }} />
                <TagActiveFilters {...{ tags, setTags }} />
                <ProductActiveFilters {...{ products, setProducts }} />
              </>
            }
            {router.pathname.indexOf('endorsers') >= 0 &&
              <>
                <SectorActiveFilters sectors={orgSectors} setSectors={setOrgSectors} />
                <EndorsingYearActiveFilters {...{ years, setYears }} />
              </>
            }
            {router.pathname.indexOf('aggregators') >= 0 &&
              <>
                <OrganizationActiveFilters aggregatorOnly organizations={aggregators} setOrganizations={setAggregators} />
                <OperatorActiveFilters operators={operators} setOperators={setOperators} />
                <CapabilityActiveFilters services={services} setServices={setServices} />
              </>
            }
          </div>
        </div>
      }
    </>
  )
}

export default MapActiveFilter
