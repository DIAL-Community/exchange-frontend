import { useRouter } from 'next/router'
import { useContext } from 'react'

import { useIntl } from 'react-intl'

import { MapFilterContext, MapFilterDispatchContext } from '../context/MapFilterContext'
import { SectorAutocomplete, SectorFilters } from './element/Sector'
import { ProductAutocomplete, ProductFilters } from './element/Product'
import { TagAutocomplete, TagFilters } from './element/Tag'
import { EndorsingYearFilters, EndorsingYearSelect } from './element/EndorsingYear'
import { CapabilityAutocomplete, CapabilityFilters } from './element/Capability'
import { OperatorAutocomplete, OperatorFilters } from './element/Operator'
import { OrganizationAutocomplete, OrganizationFilters } from './element/Organization'

const MapFilter = (props) => {
  const filterDisplayed = props.filterDisplayed
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

  const navigateToMap = (e, mapPath) => {
    e.preventDefault()
    router.push(`/maps/${mapPath}`)
  }

  return (
    <div className='px-2'>
      {
        filterDisplayed &&
          <div className='grid grid-cols-11 gap-4 pb-4 pt-2'>
            <div className='col-span-11 xl:col-span-6 border-transparent border-r lg:border-dial-purple-light'>
              <div className='text-sm text-dial-gray-light flex flex-row flex-wrap md:flex-nowrap'>
                <div className='text-white px-2 pb-2 w-full'>
                  <div className='flex flex-col'>
                    <div className='text-center whitespace-normal'>{format('map.project.title')}</div>
                    <div className='block'>
                      <a href='set-projects-active' onClick={(e) => navigateToMap(e, 'projects')}>
                        <img
                          src='/images/maps/projects.png' alt='Navigate to map of projects'
                          className={`${router.pathname.indexOf('projects') >= 0 ? 'border-4 border-dial-yellow' : ''} w-64 mt-4 mx-auto`}
                        />
                      </a>
                    </div>
                  </div>
                </div>
                <div className='text-white px-2 pb-2 w-full'>
                  <div className='flex flex-col'>
                    <div className='text-center whitespace-normal'>{format('map.endorser.title')}</div>
                    <div className='block'>
                      <a href='set-endorsers-active' onClick={(e) => navigateToMap(e, 'endorsers')}>
                        <img
                          src='/images/maps/endorsers.png' alt='Navigate to map of endorsers'
                          className={`${router.pathname.indexOf('endorsers') >= 0 ? 'border-4 border-dial-yellow' : ''} w-64 mt-4 mx-auto`}
                        />
                      </a>
                    </div>
                  </div>
                </div>
                <div className='text-white px-2 pb-2 w-full'>
                  <div className='flex flex-col'>
                    <div className='text-center whitespace-normal'>{format('map.aggregator.title')}</div>
                    <div className='block'>
                      <a href='set-aggregators-active' onClick={(e) => navigateToMap(e, 'aggregators')}>
                        <img
                          src='/images/maps/aggregators.png' alt='Navigate to map of aggregators'
                          className={`${router.pathname.indexOf('aggregators') >= 0 ? 'border-4 border-dial-yellow' : ''} w-64 mt-4 mx-auto`}
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-span-11 xl:col-span-5'>
              <div className='text-white text-xl px-2'>
                {'Map Filters'.toUpperCase()}
              </div>
              <div className='text-sm text-dial-gray-light flex flex-row flex-wrap'>
                {
                  router.pathname.indexOf('projects') >= 0 &&
                    <>
                      <SectorAutocomplete {...{ sectors, setSectors }} containerStyles='px-2 pb-2' />
                      <TagAutocomplete {...{ tags, setTags }} containerStyles='px-2 pb-2' />
                      <ProductAutocomplete {...{ products, setProducts }} containerStyles='px-2 pb-2' />
                    </>
                }
                {
                  router.pathname.indexOf('endorsers') >= 0 &&
                    <>
                      <SectorAutocomplete sectors={orgSectors} setSectors={setOrgSectors} containerStyles='px-2 pb-2' />
                      <EndorsingYearSelect {...{ years, setYears }} containerStyles='px-2 pb-2' />
                    </>
                }
                {
                  router.pathname.indexOf('aggregators') >= 0 &&
                    <>
                      <OrganizationAutocomplete
                        aggregatorOnly organizations={aggregators} setOrganizations={setAggregators}
                        containerStyles='px-2 pb-2'
                      />
                      <OperatorAutocomplete operators={operators} setOperators={setOperators} containerStyles='px-2 pb-2' />
                      <CapabilityAutocomplete services={services} setServices={setServices} containerStyles='px-2 pb-2' />
                    </>
                }
              </div>
            </div>
          </div>
      }
      <div className={`flex flex-row pb-4 ${filterCount() > 0 ? 'block' : 'hidden'}`} id='link1'>
        <div className='px-2 py-1 mt-2 text-sm text-white whitespace-nowrap'>
          {format('filter.general.applied', { count: filterCount() })}:
        </div>
        <div className='flex flex-row flex-wrap'>
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
          {
            filterCount() > 0 &&
              <a className='px-2 py-1  mt-2 text-sm text-white' href='#clear-filter' onClick={clearFilter}>
                {format('filter.general.clearAll')}
              </a>
          }
        </div>
      </div>
    </div>
  )
}

export default MapFilter
