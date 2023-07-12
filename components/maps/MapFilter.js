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

  const routeContains = (expectedText) => router.pathname.indexOf(expectedText) >= 0

  const routeDecoration = (expectedText) => {
    if (routeContains(expectedText)) {
      return 'border-4 border-dial-sunshine'
    }

    return ''
  }

  return (
    <div className='pt-6 pb-10 bg-dial-solitude rounded-lg text-dial-stratos'>
      <div className='text-dial-stratos flex flex-col gap-3 px-6'>
        <div className='whitespace-normal'>
          {format('map.project.title')}
        </div>
        <a href='navigate-to-project-map' onClick={(e) => navigateToMap(e, 'projects')}>
          <div className={`${routeDecoration('projects')} image-block-hack w-56`}>
            <Image
              height={125}
              width={225}
              src='/images/maps/projects.png'
              alt='Navigate to map of projects.'
            />
          </div>
        </a>
        <div className='whitespace-normal'>
          {format('map.endorser.title')}
        </div>
        <a href='navigate-to-endorser-map' onClick={(e) => navigateToMap(e, 'endorsers')}>
          <div className={`${routeDecoration('endorsers')} image-block-hack w-56`}>
            <Image
              height={125}
              width={225}
              src='/images/maps/endorsers.png'
              alt='Navigate to map of endorsers.'
            />
          </div>
        </a>
        <div className='whitespace-normal'>
          {format('map.aggregator.title')}
        </div>
        <a href='navigate-to-aggregator-map' onClick={(e) => navigateToMap(e, 'aggregators')}>
          <div className={`${routeDecoration('aggregators')} image-block-hack w-56`}>
            <Image
              height={125}
              width={225}
              src='/images/maps/aggregators.png'
              alt='Navigate to map of aggregators.'
            />
          </div>
        </a>
        <div className='text-xl'>
          {format('filter.entity', { entity: format('map.label') }).toUpperCase()}
        </div>
        {
          routeContains('projects') &&
            <div className='flex flex-col gap-3'>
              <SectorAutocomplete {...{ sectors, setSectors }} />
              <TagAutocomplete {...{ tags, setTags }} />
              <ProductAutocomplete {...{ products, setProducts }} />
            </div>
        }
        {
          routeContains('endorsers') &&
            <div className='flex flex-col gap-3'>
              <SectorAutocomplete sectors={orgSectors} setSectors={setOrgSectors} />
              <EndorsingYearSelect {...{ years, setYears }} />
            </div>
        }
        {
          routeContains('aggregators') &&
            <div className='flex flex-col gap-3'>
              <OrganizationAutocomplete
                aggregatorOnly
                organizations={aggregators}
                setOrganizations={setAggregators}
              />
              <OperatorAutocomplete operators={operators} setOperators={setOperators} />
              <CapabilityAutocomplete services={services} setServices={setServices} />
            </div>
        }
      </div>
    </div>
  )
}

export default MapFilter
