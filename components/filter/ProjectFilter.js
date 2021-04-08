import { useContext } from 'react'

import { ProjectFilterContext, ProjectFilterDispatchContext } from '../context/ProjectFilterContext'
import { CountryAutocomplete, CountryFilters } from './element/Country'
import { OrganizationAutocomplete, OrganizationFilters } from './element/Organization'
import { OriginAutocomplete, OriginFilters } from './element/Origin'
import { SDGAutocomplete, SDGFilters } from './element/SDG'
import { SectorAutocomplete, SectorFilters } from './element/Sector'

const ProjectFilter = (props) => {
  const openFilter = props.openFilter

  const { sectors, countries, organizations, origins, sdgs } = useContext(ProjectFilterContext)
  const { setSectors, setCountries, setOrganizations, setOrigins, setSDGs } = useContext(ProjectFilterDispatchContext)

  const hasFilter = () => {
    return countries.length > 0 || organizations.length > 0 ||
      sectors.length > 0 || origins.length > 0 || sdgs.length > 0
  }

  const clearFilter = (e) => {
    e.preventDefault()
    setOrigins([])
    setCountries([])
    setSectors([])
    setOrganizations([])
    setSDGs([])
  }

  return (
    <>
      <div className={`${openFilter ? 'block' : 'hidden'} grid grid-cols-11 gap-4 pb-4`} id='product-filter-list'>
        <div className='col-span-11 md:col-span-5 border-transparent border-r lg:border-dial-purple-light'>
          <div className='text-sm text-dial-gray-light flex flex-row'>
            <div className='text-white text-xl px-2 pb-3'>
              {'Framework Filters'.toUpperCase()}
            </div>
          </div>
          <div className='text-sm text-dial-gray-light flex flex-row'>
            <div className='pl-2 pr-4 pb-2'>
              Use elements of the Digital Investment Framework to filter Projects
            </div>
          </div>
          <div className='text-sm text-dial-gray-light flex flex-row flex-wrap'>
            <SDGAutocomplete {...{ sdgs, setSDGs }} containerStyles='px-2 pb-2' />
          </div>
        </div>
        <div className='col-span-11 md:col-span-6 px-4'>
          <div className='text-white text-xl px-2 pb-3'>
            {'Project Filters'.toUpperCase()}
          </div>
          <div className='text-sm text-dial-gray-light flex flex-row'>
            <div className='px-2 pb-2'>
              <span style={{ height: '1.875rem' }}>&nbsp;</span>
            </div>
          </div>
          <div className='text-sm text-dial-gray-light flex flex-row flex-wrap'>
            <OriginAutocomplete {...{ origins, setOrigins }} containerStyles='px-2 pb-2' />
            <CountryAutocomplete {...{ countries, setCountries }} containerStyles='px-2 pb-2' />
            <SectorAutocomplete {...{ sectors, setSectors }} containerStyles='px-2 pb-2' />
            <OrganizationAutocomplete {...{ organizations, setOrganizations }} containerStyles='px-2 pb-2' />
          </div>
        </div>
      </div>
      <div className={`flex flex-row pb-4 ${hasFilter() ? 'block' : 'hidden'}`} id='link1'>
        <div className='px-2 py-1 mt-2 text-sm text-white whitespace-nowrap'>
          Filters Applied:
        </div>
        <div className='flex flex-row flex-wrap'>
          <OriginFilters {...{ origins, setOrigins }} />
          <CountryFilters {...{ countries, setCountries }} />
          <SectorFilters {...{ sectors, setSectors }} />
          <OrganizationFilters {...{ organizations, setOrganizations }} />
          <SDGFilters {...{ sdgs, setSDGs }} />
          {
            hasFilter() &&
              <a className='px-2 py-1  mt-2 text-sm text-white' href='#clear-filter' onClick={clearFilter}>
                Clear all
              </a>
          }
        </div>
      </div>
    </>
  )
}

export default ProjectFilter
