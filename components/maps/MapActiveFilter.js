import { useRouter } from 'next/router'
import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { FilterContext, FilterDispatchContext } from '../context/FilterContext'
import { CapabilityActiveFilters } from '../shared/filter/Capability'
import { EndorsingYearActiveFilters } from '../shared/filter/EndorsingYear'
import { OperatorActiveFilters } from '../shared/filter/Operator'
import { OrganizationActiveFilters } from '../shared/filter/Organization'
import { ProductActiveFilters } from '../shared/filter/Product'
import { SectorActiveFilters } from '../shared/filter/Sector'
import { TagActiveFilters } from '../shared/filter/Tag'

const MapActiveFilter = () => {
  const router = useRouter()

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    aggregators,
    operators,
    products,
    sectors,
    services,
    tags,
    years
  } = useContext(FilterContext)

  const {
    setAggregators,
    setOperators,
    setProducts,
    setSectors,
    setServices,
    setTags,
    setYears
  } = useContext(FilterDispatchContext)

  const filteringMap = () => {
    if (router.pathname.indexOf('projects') >= 0) {
      return sectors.length + tags.length + products.length > 0
    } else if (router.pathname.indexOf('endorsers') >= 0) {
      return sectors.length + years.length > 0
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
      setSectors([])
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
              <button type='button' onClick={clearFilter}>
                <span className='text-dial-sapphire'>
                  {format('ui.filter.clearAll')}
                </span>
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
                <SectorActiveFilters sectors={sectors} setSectors={setSectors} />
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
