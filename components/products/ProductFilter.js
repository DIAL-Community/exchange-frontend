import Image from 'next/image'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { ProductFilterContext, ProductFilterDispatchContext } from '../context/ProductFilterContext'
import { BuildingBlockAutocomplete } from '../filter/element/BuildingBlock'
import { CountryAutocomplete } from '../filter/element/Country'
import { EndorserAutocomplete } from '../filter/element/Endorser'
import { OrganizationAutocomplete } from '../filter/element/Organization'
import { OriginAutocomplete } from '../filter/element/Origin'
import { SDGAutocomplete } from '../filter/element/SDG'
import { SectorAutocomplete } from '../filter/element/Sector'
import { TagAutocomplete } from '../filter/element/Tag'
import { UseCaseAutocomplete } from '../filter/element/UseCase'
import { WorkflowAutocomplete } from '../filter/element/Workflow'
import Checkbox from '../shared/Checkbox'
import { LicenseTypeSelect } from '../filter/element/LicenseType'
import ProductHint from '../filter/hint/ProductHint'

const COVID_19_LABEL = 'COVID-19'

const ProductFilter = ({ inMobileView }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    isEndorsed, sectors, countries, organizations, origins, sdgs, tags,
    useCases, workflows, buildingBlocks, endorsers, licenseTypes, isLinkedWithDpi
  } = useContext(ProductFilterContext)

  const {
    setIsEndorsed, setSectors, setCountries, setOrganizations,
    setOrigins, setSDGs, setTags, setUseCases, setWorkflows, setBuildingBlocks,
    setEndorsers, setLicenseTypes, setIsLinkedWithDpi
  } = useContext(ProductFilterDispatchContext)

  const toggleIsEndorsed = () => setIsEndorsed(!isEndorsed)
  const toggleLinkedWithDpi = () => setIsLinkedWithDpi(!isLinkedWithDpi)

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

  const [openingDetail, setOpeningDetail] = useState(false)
  const toggleHintDetail = () => {
    setOpeningDetail(!openingDetail)
  }

  return (
    <div className='pt-6 pb-10 bg-dial-solitude rounded-lg text-dial-stratos'>
      <div className='text-dial-stratos flex flex-col gap-3'>
        <div className={`px-6 text-base flex ${!inMobileView && 'intro-overview-entity-help'}`}>
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
            <span className='py-1 border-b-2 border-transparent hover:border-dial-sunshine'>
              {format('filter.hint.text')} {format('ui.product.label')}
            </span>
          </a>
        </div>
        <hr className={`${openingDetail ? 'block' : 'hidden'} border-b border-dial-white-beech`} />
        <div className={`px-6 hidden ${openingDetail ? ' slide-down' : 'slide-up'}`}>
          <ProductHint />
        </div>
        <hr className='border-b border-dial-white-beech' />
        <div className={`text-xl px-6 ${!inMobileView && 'intro-overview-filter'}`}>
          {format('filter.framework.title').toUpperCase()}
        </div>
        <div className='px-6'>
          {format('filter.framework.subTitle', { entity: format('ui.product.header') })}
        </div>
        <div className='flex flex-col gap-3 px-6'>
          <SDGAutocomplete {...{ sdgs, setSDGs }} />
          <UseCaseAutocomplete {...{ useCases, setUseCases }} />
          <WorkflowAutocomplete {...{ workflows, setWorkflows }} />
          <BuildingBlockAutocomplete {...{ buildingBlocks, setBuildingBlocks }} />
          <TagAutocomplete {...{ tags, setTags }} />
        </div>
        <div className='text-xl px-6'>
          {format('filter.entity', { entity: format('ui.product.label') }).toUpperCase()}
        </div>
        <div className='flex flex-col gap-3 px-6'>
          <label className='inline'>
            <Checkbox onChange={toggleCovid19Tag} value={isCovid19TagActive} />
            <span className='mx-2 my-auto'>
              {format('filter.product.forCovid')}
            </span>
          </label>
          <label className='inline'>
            <Checkbox onChange={toggleIsEndorsed} value={isEndorsed} />
            <span className='mx-2 my-auto'>
              {format('filter.product.endorsed')}
            </span>
          </label>
          <label className='flex'>
            <Checkbox onChange={toggleLinkedWithDpi} value={isLinkedWithDpi} />
            <span className='mx-2 my-auto'>
              {format('filter.product.linkedWithDpi')}
            </span>
            <span className='w-6 my-auto image-block-hack'>
              <Image
                width={34}
                height={34}
                src='/assets/info.png'
                alt='Informational hint'
                data-tooltip-id='react-tooltip'
                data-tooltip-html={format('filter.product.dpiDefinition')}
              />
            </span>
          </label>
        </div>
        <div className='flex flex-col gap-3 px-6'>
          <LicenseTypeSelect {...{ licenseTypes, setLicenseTypes }} />
          <OriginAutocomplete {...{ origins, setOrigins }} />
          <EndorserAutocomplete {...{ endorsers, setEndorsers }} />
          <CountryAutocomplete {...{ countries, setCountries }} />
          <SectorAutocomplete {...{ sectors, setSectors }} />
          <OrganizationAutocomplete {...{ organizations, setOrganizations }} />
        </div>
      </div>
    </div>
  )
}

export default ProductFilter
