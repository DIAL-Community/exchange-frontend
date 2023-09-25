import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { FaAngleUp, FaAngleDown } from 'react-icons/fa6'
import {
  ProjectFilterContext,
  ProjectFilterDispatchContext
} from '../../context/ProjectFilterContext'
import Checkbox from '../../shared/form/Checkbox'
import { TagActiveFilters, TagAutocomplete } from '../../shared/filter/Tag'
import { OriginActiveFilters, OriginAutocomplete } from '../../shared/filter/Origin'
import { SectorActiveFilters, SectorAutocomplete } from '../../shared/filter/Sector'
import { SdgActiveFilters, SdgAutocomplete } from '../../shared/filter/Sdg'
import { CountryAutocomplete, CountryActiveFilters } from '../../shared/filter/Country'
import { ProductActiveFilters, ProductAutocomplete } from '../../shared/filter/Product'
import { OrganizationActiveFilters, OrganizationAutocomplete } from '../../shared/filter/Organization'

const COVID_19_LABEL = 'COVID-19'

const ProjectFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { countries, products, organizations, sectors, tags } = useContext(ProjectFilterContext)
  const { setCountries, setProducts, setOrganizations, setSectors, setTags } = useContext(ProjectFilterDispatchContext)

  const { sdgs, origins } = useContext(ProjectFilterContext)
  const { setSdgs, setOrigins } = useContext(ProjectFilterDispatchContext)

  const [expanded, setExpanded] = useState(false)

  const isCovid19TagActive = tags.some(({ slug }) => slug === COVID_19_LABEL)

  const toggleCovid19Tag = () => {
    const tagsWithoutCovid19 = tags.filter(({ slug }) => slug !== COVID_19_LABEL)
    setTags(isCovid19TagActive
      ? tagsWithoutCovid19
      : [
        ...tagsWithoutCovid19,
        { label: COVID_19_LABEL, value: COVID_19_LABEL, slug: COVID_19_LABEL }
      ]
    )
  }

  const clearFilter = (e) => {
    e.preventDefault()

    setCountries([])
    setProducts([])
    setOrganizations([])
    setSectors([])
    setTags([])

    setSdgs([])
    setOrigins([])
  }

  const filteringProject = () => {
    return countries.length +
      products.length +
      organizations.length +
      sectors.length +
      tags.length +
      sdgs.length +
      origins.length > 0
  }

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      {filteringProject() &&
        <div className='flex flex-col gap-y-3'>
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
            <ProductActiveFilters products={products} setProducts={setProducts} />
            <OrganizationActiveFilters organizations={organizations} setOrganizations={setOrganizations} />
            <SectorActiveFilters sectors={sectors} setSectors={setSectors} />
            <TagActiveFilters tags={tags} setTags={setTags} />
            <CountryActiveFilters countries={countries} setCountries={setCountries} />
            <SdgActiveFilters sdgs={sdgs} setSdgs={setSdgs} />
            <OriginActiveFilters origins={origins} setOrigins={setOrigins} />
          </div>
        </div>
      }
      <div className='flex flex-col gap-y-2'>
        <div className='text-sm font-semibold text-dial-sapphire'>
          {format('ui.filter.primary.title')}
        </div>
        <hr className='border-b border-dial-slate-200'/>
        <ProductAutocomplete products={products} setProducts={setProducts} />
        <hr className='border-b border-dial-slate-200'/>
        <OrganizationAutocomplete organizations={organizations} setOrganizations={setOrganizations} />
        <hr className='border-b border-dial-slate-200'/>
        <SectorAutocomplete sectors={sectors} setSectors={setSectors} />
        <hr className='border-b border-dial-slate-200'/>
        <TagAutocomplete tags={tags} setTags={setTags} />
        <hr className='border-b border-dial-slate-200'/>
      </div>
      <div className='flex flex-col gap-y-2'>
        <div className='text-sm font-semibold text-dial-sapphire'>
          <button type='button' onClick={() => setExpanded(!expanded)}>
            <div className='flex text-dial-sapphire gap-3'>
              <div className='my-auto'>
                {format('ui.filter.additional.title')}
              </div>
              <div className='ml-auto py-2 text-xl'>
                {expanded ? <FaAngleUp /> : <FaAngleDown />}
              </div>
            </div>
          </button>
        </div>
        {expanded &&
          <>
            <label className='flex py-2'>
              <Checkbox value={isCovid19TagActive} onChange={toggleCovid19Tag} />
              <span className='mx-2 my-auto text-sm'>
                {format('filter.project.forCovid')}
              </span>
            </label>
            <hr className='border-b border-dial-slate-200'/>
            <CountryAutocomplete countries={countries} setCountries={setCountries} />
            <hr className='border-b border-dial-slate-200'/>
            <SdgAutocomplete sdgs={sdgs} setSdgs={setSdgs} />
            <hr className='border-b border-dial-slate-200'/>
            <OriginAutocomplete origins={origins} setOrigins={setOrigins} />
            <hr className='border-b border-dial-slate-200'/>
          </>
        }
      </div>
    </div>
  )
}

export default ProjectFilter
