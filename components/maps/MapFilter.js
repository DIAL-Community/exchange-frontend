import { useRouter } from 'next/router'
import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import Image from 'next/image'
import { MapFilterContext, MapFilterDispatchContext } from '../context/MapFilterContext'
import { CapabilityAutocomplete } from '../filter/element/Capability'
import { EndorsingYearSelect } from '../filter/element/EndorsingYear'
import { OperatorAutocomplete } from '../filter/element/Operator'
import { OrganizationAutocomplete } from '../filter/element/Organization'
import { ProductAutocomplete } from '../filter/element/Product'
import { SectorAutocomplete } from '../filter/element/Sector'
import { TagAutocomplete } from '../filter/element/Tag'

const MapFilter = () => {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    aggregators, operators, services, orgSectors, years, sectors, products, tags
  } = useContext(MapFilterContext)

  const {
    setAggregators, setOperators, setServices, setOrgSectors, setYears, setSectors, setProducts, setTags
  } = useContext(MapFilterDispatchContext)

  const navigateToMap = (e, mapPath) => {
    e.preventDefault()
    router.push(`/maps/${mapPath}`)
  }

  return (
    <div className='px-4 py-4'>
      <div className='pb-4 pt-2'>
        <div className='text-sm text-dial-gray-dark flex flex-row flex-wrap'>
          <div className='px-2 pb-2 w-full'>
            <div className='flex flex-col'>
              <div className='whitespace-normal'>{format('map.project.title')}</div>
              <div className='block'>
                <a href='set-projects-active' onClick={(e) => navigateToMap(e, 'projects')}>
                  <Image
                    height={125}
                    width={225}
                    src='/images/maps/projects.png' alt='Navigate to map of projects'
                    className={`${router.pathname.indexOf('projects') >= 0 ? 'border-4 border-dial-yellow' : ''} w-56 mt-2`}
                  />
                </a>
              </div>
            </div>
          </div>
          <div className='px-2 pb-2 w-full'>
            <div className='flex flex-col'>
              <div className='whitespace-normal'>{format('map.endorser.title')}</div>
              <div className='block'>
                <a href='set-endorsers-active' onClick={(e) => navigateToMap(e, 'endorsers')}>
                  <Image
                    height={125}
                    width={225}
                    src='/images/maps/endorsers.png' alt='Navigate to map of endorsers'
                    className={`${router.pathname.indexOf('endorsers') >= 0 ? 'border-4 border-dial-yellow' : ''} w-56 mt-2`}
                  />
                </a>
              </div>
            </div>
          </div>
          <div className='px-2 pb-2 w-full'>
            <div className='flex flex-col'>
              <div className='whitespace-normal'>{format('map.aggregator.title')}</div>
              <div className='block'>
                <a href='set-aggregators-active' onClick={(e) => navigateToMap(e, 'aggregators')}>
                  <Image
                    height={125}
                    width={225}
                    src='/images/maps/aggregators.png' alt='Navigate to map of aggregators'
                    className={`${router.pathname.indexOf('aggregators') >= 0 ? 'border-4 border-dial-yellow' : ''} w-56 mt-2`}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className='col-span-11 xl:col-span-5'>
          <div className='text-dial-gray-dark text-xl px-2 py-2'>
            {'Map Filters'.toUpperCase()}
          </div>
          <div className='text-sm text-dial-gray-light flex flex-row flex-wrap'>
            {
              router.pathname.indexOf('projects') >= 0 &&
                <>
                  <SectorAutocomplete {...{ sectors, setSectors }} containerStyles='px-2 pb-2' controlSize='20rem' />
                  <TagAutocomplete {...{ tags, setTags }} containerStyles='px-2 pb-2' controlSize='20rem' />
                  <ProductAutocomplete {...{ products, setProducts }} containerStyles='px-2 pb-2' controlSize='20rem' />
                </>
            }
            {
              router.pathname.indexOf('endorsers') >= 0 &&
                <>
                  <SectorAutocomplete sectors={orgSectors} setSectors={setOrgSectors} containerStyles='px-2 pb-2' controlSize='20rem' />
                  <EndorsingYearSelect {...{ years, setYears }} containerStyles='px-2 pb-2' controlSize='20rem' />
                </>
            }
            {
              router.pathname.indexOf('aggregators') >= 0 &&
                <>
                  <OrganizationAutocomplete
                    aggregatorOnly organizations={aggregators} setOrganizations={setAggregators}
                    containerStyles='px-2 pb-2' controlSize='20rem'
                  />
                  <OperatorAutocomplete operators={operators} setOperators={setOperators} containerStyles='px-2 pb-2' controlSize='20rem' />
                  <CapabilityAutocomplete services={services} setServices={setServices} containerStyles='px-2 pb-2' controlSize='20rem' />
                </>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapFilter
