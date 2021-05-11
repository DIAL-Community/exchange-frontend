import { useRouter } from 'next/router'
import { useContext } from 'react'

import { MapFilterContext, MapFilterDispatchContext } from '../context/MapFilterContext'
import { SectorAutocomplete, SectorFilters } from './element/Sector'

const MapFilter = (props) => {
  const openFilter = props.openFilter
  const router = useRouter()

  const {
    aggregators, operators, services, sectors, years
  } = useContext(MapFilterContext)

  const {
    setAggregators, setOperators, setServices, setSectors, setYears
  } = useContext(MapFilterDispatchContext)

  const hasFilter = () => {
    return aggregators.length > 0 || operators.length > 0 || services.length > 0 ||
      sectors.length > 0 || years.length > 0
  }

  const clearFilter = (e) => {
    e.preventDefault()
    setSectors([])
  }

  const navigateToMap = (e, mapPath) => {
    e.preventDefault()
    router.push(`/maps/${mapPath}`)
  }

  return (
    <div className='px-2'>
      {
        openFilter &&
          <div className='grid grid-cols-11 gap-4 pb-4 pt-2'>
            <div className='col-span-11 xl:col-span-6 border-transparent border-r lg:border-dial-purple-light'>
              <div className='text-sm text-dial-gray-light flex flex-row flex-wrap md:flex-nowrap'>
                <div className='text-white px-2 pb-2 w-full'>
                  <div className='flex flex-col'>
                    <div className='text-center whitespace-normal'>Map of Digital Principles Endorsers</div>
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
                    <div className='text-center whitespace-normal'>Aggregator & Operator Coverage Map</div>
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
                <div className='text-white px-2 pb-2 w-full'>
                  <div className='flex flex-col'>
                    <div className='text-center whitespace-normal'>Map of Projects</div>
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
              </div>
            </div>
            <div className='col-span-11 xl:col-span-5'>
              <div className='text-white text-xl px-2 pb-3'>
                {'Map Filters'.toUpperCase()}
              </div>
              <div className='text-sm text-dial-gray-light flex flex-row flex-wrap'>
                <SectorAutocomplete {...{ sectors, setSectors }} containerStyles='px-2 pb-2' />
              </div>
            </div>
          </div>
      }
      <div className={`flex flex-row pb-4 ${hasFilter() ? 'block' : 'hidden'}`} id='link1'>
        <div className='px-2 py-1 mt-2 text-sm text-white whitespace-nowrap'>
          Filters Applied:
        </div>
      </div>
      <div className={`flex flex-row pb-4 ${hasFilter() ? 'block' : 'hidden'}`} id='link1'>
        <div className='px-2 py-1 mt-2 text-sm text-white whitespace-nowrap'>
          Filters Applied:
        </div>
        <div className='flex flex-row flex-wrap'>
          <SectorFilters {...{ sectors, setSectors }} />
          {
            hasFilter() &&
              <a className='px-2 py-1  mt-2 text-sm text-white' href='#clear-filter' onClick={clearFilter}>
                Clear all
              </a>
          }
        </div>
      </div>
    </div>
  )
}

export default MapFilter
