import Image from 'next/image'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { ProjectFilterContext, ProjectFilterDispatchContext } from '../context/ProjectFilterContext'
import { CountryAutocomplete } from '../filter/element/Country'
import { OrganizationAutocomplete } from '../filter/element/Organization'
import { OriginAutocomplete } from '../filter/element/Origin'
import { ProductAutocomplete } from '../filter/element/Product'
import { SDGAutocomplete } from '../filter/element/SDG'
import { SectorAutocomplete } from '../filter/element/Sector'
import { TagAutocomplete } from '../filter/element/Tag'
import ProjectHint from '../filter/hint/ProjectHint'

const ProjectFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { sectors, countries, organizations, products, origins, sdgs, tags } =
    useContext(ProjectFilterContext)
  const { setSectors, setCountries, setOrganizations, setProducts, setOrigins, setSDGs, setTags } =
    useContext(ProjectFilterDispatchContext)

  const [openingDetail, setOpeningDetail] = useState(false)
  const toggleHintDetail = () => {
    setOpeningDetail(!openingDetail)
  }

  return (
    <div className='pt-6 pb-10 bg-dial-solitude rounded-lg text-dial-stratos'>
      <div className='text-dial-stratos flex flex-col gap-3'>
        <div className='px-6 text-base flex'>
          <a
            className='cursor-pointer font-semibold flex gap-2'
            onClick={() => toggleHintDetail()}
          >
            <div className='w-6 my-auto image-block-hack'>
              <Image
                width={34}
                height={34}
                src='/assets/info.png'
                alt='Informational hint'
              />
            </div>
            <span className='py-1 border-b-2 border-transparent hover:border-dial-yellow'>
              {format('filter.hint.text')} {format('project.label')}
            </span>
          </a>
        </div>
        <hr className={`${openingDetail ? 'block' : 'hidden'} border-b border-dial-white-beech`} />
        <div className={`px-6 hidden ${openingDetail ? ' slide-down' : 'slide-up'}`}>
          <ProjectHint />
        </div>
        <hr className='border-b border-dial-white-beech' />
        <div className='text-xl px-6'>
          {format('filter.framework.title').toUpperCase()}
        </div>
        <div className='px-6'>
          {format('filter.framework.subTitle', { entity: format('project.header') })}
        </div>
        <div className='flex flex-col gap-3 px-6'>
          <SDGAutocomplete {...{ sdgs, setSDGs }} />
        </div>
        <div className='text-xl px-6'>
          {format('filter.entity', { entity: format('project.label') }).toUpperCase()}
        </div>
        <div className='flex flex-col gap-3 px-6'>
          <OriginAutocomplete {...{ origins, setOrigins }} />
          <CountryAutocomplete {...{ countries, setCountries }} />
          <SectorAutocomplete {...{ sectors, setSectors }} />
          <ProductAutocomplete {...{ products, setProducts }} />
          <OrganizationAutocomplete {...{ organizations, setOrganizations }} />
          <TagAutocomplete {...{ tags, setTags }} />
        </div>
      </div>
    </div>
  )
}

export default ProjectFilter
