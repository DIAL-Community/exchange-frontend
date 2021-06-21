import { useContext } from 'react'
import { useIntl } from 'react-intl'

import { ProjectFilterContext, ProjectFilterDispatchContext } from '../context/ProjectFilterContext'
import { CountryAutocomplete, CountryFilters } from './element/Country'
import { OrganizationAutocomplete, OrganizationFilters } from './element/Organization'
import { ProductAutocomplete, ProductFilters } from './element/Product'
import { OriginAutocomplete, OriginFilters } from './element/Origin'
import { SDGAutocomplete, SDGFilters } from './element/SDG'
import { TagAutocomplete, TagFilters } from './element/Tag'
import { SectorAutocomplete, SectorFilters } from './element/Sector'

const ProjectFilter = (props) => {
  const openFilter = props.openFilter

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { sectors, countries, organizations, products, origins, sdgs, tags } = useContext(ProjectFilterContext)
  const { setSectors, setCountries, setOrganizations, setProducts, setOrigins, setSDGs, setTags } = useContext(ProjectFilterDispatchContext)

  const filterCount = () => {
    return countries.length + organizations.length + products.length + sectors.length + origins.length + sdgs.length + tags.length
  }

  const clearFilter = (e) => {
    e.preventDefault()
    setOrigins([])
    setCountries([])
    setProducts([])
    setSectors([])
    setOrganizations([])
    setSDGs([])
    setTags([])
  }

  return (
    <div className='px-2'>
      {
        openFilter &&
          <div className='grid grid-cols-11 gap-4 pb-4 pt-2'>
            <div className='col-span-11 md:col-span-5 border-transparent border-r lg:border-dial-purple-light'>
              <div className='text-sm text-dial-gray-light flex flex-row'>
                <div className='text-white text-xl px-2 pb-3'>
                  {format('filter.framework.title').toUpperCase()}
                </div>
              </div>
              <div className='text-sm text-dial-gray-light flex flex-row'>
                <div className='pl-2 pr-4 pb-2'>
                  {format('filter.framework.subTitle', { entity: format('project.header') })}
                </div>
              </div>
              <div className='text-sm text-dial-gray-light flex flex-row flex-wrap'>
                <SDGAutocomplete {...{ sdgs, setSDGs }} containerStyles='px-2 pb-2' />
              </div>
            </div>
            <div className='col-span-11 md:col-span-6'>
              <div className='text-white text-xl px-2 pb-3'>
                {format('filter.entity', { entity: format('project.label') }).toUpperCase()}
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
                <ProductAutocomplete {...{ products, setProducts }} containerStyles='px-2 pb-2' />
                <TagAutocomplete {...{ tags, setTags }} containerStyles='px-2 pb-2' />
              </div>
            </div>
          </div>
      }
      <div className={`flex flex-row pb-4 ${filterCount() > 0 ? 'block' : 'hidden'}`} id='link1'>
        <div className='px-2 py-1 mt-2 text-sm text-white whitespace-nowrap'>
          {format('filter.general.applied', { count: filterCount() })}:
        </div>
        <div className='flex flex-row flex-wrap'>
          <OriginFilters {...{ origins, setOrigins }} />
          <CountryFilters {...{ countries, setCountries }} />
          <SectorFilters {...{ sectors, setSectors }} />
          <OrganizationFilters {...{ organizations, setOrganizations }} />
          <ProductFilters {...{ products, setProducts }} />
          <SDGFilters {...{ sdgs, setSDGs }} />
          <TagFilters {...{ tags, setTags }} />
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

export default ProjectFilter
