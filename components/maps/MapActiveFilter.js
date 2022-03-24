import { useRouter } from 'next/router'
import { useContext } from 'react'
import { useIntl } from 'react-intl'

import { MapFilterContext, MapFilterDispatchContext } from '../context/MapFilterContext'

import { SectorFilters } from '../filter/element/Sector'
import { TagFilters } from '../filter/element/Tag'
import { ProductFilters } from '../filter/element/Product'
import { EndorsingYearFilters } from '../filter/element/EndorsingYear'
import { OrganizationFilters } from '../filter/element/Organization'
import { OperatorFilters } from '../filter/element/Operator'
import { CapabilityFilters } from '../filter/element/Capability'

const MapActiveFilter = () => {
  const router = useRouter()

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const {
    aggregators, operators, services, orgSectors, years, sectors, products, tags
  } = useContext(MapFilterContext)

  const {
    setAggregators, setOperators, setServices, setOrgSectors, setYears, setSectors, setProducts, setTags
  } = useContext(MapFilterDispatchContext)

  const filterCount = () => {
    if (router.pathname.indexOf('projects') >= 0) {
      return sectors.length + tags.length + products.length
    } else if (router.pathname.indexOf('endorsers') >= 0) {
      return orgSectors.length + years.length
    } else if (router.pathname.indexOf('aggregators') >= 0) {
      return aggregators.length + operators.length + services.length
    }

    return 0
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
    <div className={`flex flex-row pt-2 ${filterCount() > 0 ? 'block' : 'hidden'}`} id='link1'>
      <div className='flex flex-row flex-wrap px-3 gap-2'>
        {
          router.pathname.indexOf('projects') >= 0 &&
            <>
              <SectorFilters {...{ sectors, setSectors }} />
              <TagFilters {...{ tags, setTags }} />
              <ProductFilters {...{ products, setProducts }} />
            </>
        }
        {
          router.pathname.indexOf('endorsers') >= 0 &&
            <>
              <SectorFilters sectors={orgSectors} setSectors={setOrgSectors} />
              <EndorsingYearFilters {...{ years, setYears }} />
            </>
        }
        {
          router.pathname.indexOf('aggregators') >= 0 &&
            <>
              <OrganizationFilters aggregatorOnly organizations={aggregators} setOrganizations={setAggregators} />
              <OperatorFilters operators={operators} setOperators={setOperators} />
              <CapabilityFilters services={services} setServices={setServices} />
            </>
        }

        <div className='flex px-2 py-1 mt-2 text-sm text-dial-gray-dark'>
          <a
            className='border-b-2 border-transparent hover:border-dial-yellow my-auto opacity-50'
            href='#clear-filter' onClick={clearFilter}
          >
            {format('filter.general.clearAll')}
          </a>
        </div>
      </div>
    </div>
  )
}

export default MapActiveFilter
