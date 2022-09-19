import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { BsQuestionCircleFill } from 'react-icons/bs'
import { FilterContext } from '../context/FilterContext'
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

const ProductFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { setHintDisplayed } = useContext(FilterContext)

  const {
    withMaturity, productDeployable, forCovid, sectors, countries, organizations, origins, sdgs, tags,
    useCases, workflows, buildingBlocks, endorsers, licenseTypes
  } = useContext(ProductFilterContext)

  const {
    setWithMaturity, setProductDeployable, setForCovid, setSectors, setCountries, setOrganizations,
    setOrigins, setSDGs, setTags, setUseCases, setWorkflows, setBuildingBlocks, setEndorsers, setLicenseTypes
  } = useContext(ProductFilterDispatchContext)

  const toggleWithMaturity = () => {
    setWithMaturity(!withMaturity)
  }

  const toggleProductDeployable = () => {
    setProductDeployable(!productDeployable)
  }

  const toggleForCovid = () => {
    !forCovid
      ? setTags([...tags.filter(s => s.value !== 'COVID-19'), { label: 'COVID-19', value: 'COVID-19', slug: 'COVID-19' }])
      : setTags(tags.filter(tag => tag.value !== 'COVID-19'))

    setForCovid(!forCovid)
  }

  return (
    <div className='px-4 py-4'>
      <div className='text-dial-gray-dark'>
        <div className='px-2 mb-4 text-xs'>
          <a className='cursor-pointer font-semibold flex gap-1' onClick={() => setHintDisplayed(true)}>
            {format('filter.hint.text')} {format('product.label')}
            <BsQuestionCircleFill className='inline text-sm mb-1' />
          </a>
        </div>
        <div className='text-sm flex flex-row'>
          <div className='text-xl px-2 pb-3'>
            {format('filter.framework.title').toUpperCase()}
          </div>
        </div>
        <div className='text-sm flex flex-row'>
          <div className='pl-2 pr-4 pb-2'>
            {format('filter.framework.subTitle', { entity: format('product.header') })}
          </div>
        </div>
        <div className='text-sm flex flex-row flex-wrap'>
          <SDGAutocomplete {...{ sdgs, setSDGs }} containerStyles='px-2 pb-2' controlSize='20rem' />
          <UseCaseAutocomplete {...{ useCases, setUseCases }} containerStyles='px-2 pb-2' controlSize='20rem' />
          <WorkflowAutocomplete {...{ workflows, setWorkflows }} containerStyles='px-2 pb-2' controlSize='20rem' />
          <BuildingBlockAutocomplete {...{ buildingBlocks, setBuildingBlocks }} containerStyles='px-2 pb-2' controlSize='20rem' />
          <TagAutocomplete {...{ tags, setTags }} containerStyles='px-2 pb-2' controlSize='20rem' />
        </div>
        <div className='col-span-11 lg:col-span-6'>
          <div className='text-xl px-2 pb-3 pt-2'>
            {format('filter.entity', { entity: format('product.label') }).toUpperCase()}
          </div>
          <div className='text-sm flex flex-col'>
            <div className='px-2 pb-2'>
              <label className='inline-flex items-center'>
                <Checkbox onChange={toggleForCovid} value={forCovid} />
                <span className='ml-2'>{format('filter.product.forCovid')}</span>
              </label>
            </div>
            <div className='px-2 pb-2'>
              <label className='inline-flex items-center'>
                <Checkbox onChange={toggleWithMaturity} value={withMaturity} />
                <span className='ml-2'>{format('filter.product.withMaturity')}</span>
              </label>
            </div>
            <div className='px-2 pb-2'>
              <label className='inline-flex items-center'>
                <Checkbox onChange={toggleProductDeployable} value={productDeployable} />
                <span className='ml-2'>{format('filter.product.launchable')}</span>
              </label>
            </div>
          </div>
          <div className='text-sm text-dial-gray-light flex flex-row flex-wrap'>
            <LicenseTypeSelect {...{ licenseTypes, setLicenseTypes }} containerStyles='px-2 pb-2' controlSize='20rem' />
            <OriginAutocomplete {...{ origins, setOrigins }} containerStyles='px-2 pb-2' controlSize='20rem' />
            <EndorserAutocomplete {...{ endorsers, setEndorsers }} containerStyles='px-2 pb-2' controlSize='20rem' />
            <CountryAutocomplete {...{ countries, setCountries }} containerStyles='px-2 pb-2' controlSize='20rem' />
            <SectorAutocomplete {...{ sectors, setSectors }} containerStyles='px-2 pb-2' controlSize='20rem' />
            <OrganizationAutocomplete {...{ organizations, setOrganizations }} containerStyles='px-2 pb-2' controlSize='20rem' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductFilter
