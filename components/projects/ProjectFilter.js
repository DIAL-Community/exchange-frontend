import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { BsQuestionCircleFill } from 'react-icons/bs'
import { FilterContext } from '../context/FilterContext'
import { ProjectFilterContext, ProjectFilterDispatchContext } from '../context/ProjectFilterContext'
import { CountryAutocomplete } from '../filter/element/Country'
import { OrganizationAutocomplete } from '../filter/element/Organization'
import { OriginAutocomplete } from '../filter/element/Origin'
import { ProductAutocomplete } from '../filter/element/Product'
import { SDGAutocomplete } from '../filter/element/SDG'
import { SectorAutocomplete } from '../filter/element/Sector'
import { TagAutocomplete } from '../filter/element/Tag'

const ProjectFilter = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { setHintDisplayed } = useContext(FilterContext)

  const { sectors, countries, organizations, products, origins, sdgs, tags } = useContext(ProjectFilterContext)
  const { setSectors, setCountries, setOrganizations, setProducts, setOrigins, setSDGs, setTags } = useContext(ProjectFilterDispatchContext)

  return (
    <div className='px-4 py-4'>
      <div className='text-dial-gray-dark'>
        <div className='px-2 mb-4 text-xs'>
          <button className='font-semibold flex gap-1' onClick={() => setHintDisplayed(true)}>
            {format('filter.hint.text')} {format('project.label')}
            <BsQuestionCircleFill className='inline text-sm mb-1' />
          </button>
        </div>
        <div className='text-sm text-dial-gray-dark flex flex-row'>
          <div className='text-xl px-2 pb-3'>
            {format('filter.framework.title').toUpperCase()}
          </div>
        </div>
        <div className='text-sm text-dial-gray-dark flex flex-row'>
          <div className='pl-2 pr-4 pb-2'>
            {format('filter.framework.subTitle', { entity: format('project.header') })}
          </div>
        </div>
        <div className='text-sm text-dial-gray-dark flex flex-row flex-wrap'>
          <SDGAutocomplete {...{ sdgs, setSDGs }} containerStyles='px-2 pb-2' controlSize='20rem' />
        </div>
        <div className='col-span-11 lg:col-span-6'>
          <div className='text-dial-gray-dark text-xl px-2 py-2'>
            {format('filter.entity', { entity: format('project.label') }).toUpperCase()}
          </div>
          <div className='text-sm text-dial-gray-light flex flex-row flex-wrap'>
            <OriginAutocomplete {...{ origins, setOrigins }} containerStyles='px-2 pb-2' controlSize='20rem' />
            <CountryAutocomplete {...{ countries, setCountries }} containerStyles='px-2 pb-2' controlSize='20rem' />
            <SectorAutocomplete {...{ sectors, setSectors }} containerStyles='px-2 pb-2' controlSize='20rem' />
            <ProductAutocomplete {...{ products, setProducts }} containerStyles='px-2 pb-2' controlSize='20rem' />
            <OrganizationAutocomplete {...{ organizations, setOrganizations }} containerStyles='px-2 pb-2' controlSize='20rem' />
            <TagAutocomplete {...{ tags, setTags }} containerStyles='px-2 pb-2' controlSize='20rem' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectFilter
