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

const COVID_19_LABEL = 'COVID-19'

const ProductFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { setHintDisplayed } = useContext(FilterContext)

  const {
    isEndorsed, productDeployable, sectors, countries, organizations, origins, sdgs, tags,
    useCases, workflows, buildingBlocks, endorsers, licenseTypes
  } = useContext(ProductFilterContext)

  const {
    setIsEndorsed, setProductDeployable, setSectors, setCountries, setOrganizations,
    setOrigins, setSDGs, setTags, setUseCases, setWorkflows, setBuildingBlocks, setEndorsers, setLicenseTypes
  } = useContext(ProductFilterDispatchContext)

  const toggleIsEndorsed = () => setIsEndorsed(!isEndorsed)

  const toggleProductDeployable = () => setProductDeployable(!productDeployable)

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

  return (
    <div className='p-4'>
      <div className='text-dial-gray-dark'>
        <div className='px-2 mb-4 text-base'>
          <a
            className={`
              cursor-pointer items-center font-semibold hover:underline
              decoration-2 decoration-dial-yellow intro-overview-entity-help
            `}
            onClick={() => setHintDisplayed(true)}
          >
            <span className='mr-1'>
              {format('filter.hint.text')} {format('product.label')}
            </span>
            <BsQuestionCircleFill className='inline text-xl mb-1 fill-dial-yellow' />
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
        <div className='text-sm flex flex-row flex-wrap intro-overview-filter'>
          <SDGAutocomplete
            {...{ sdgs, setSDGs }}
            containerStyles='px-2 pb-2'
            controlSize='20rem'
          />
          <UseCaseAutocomplete
            {...{ useCases, setUseCases }}
            containerStyles='px-2 pb-2'
            controlSize='20rem'
          />
          <WorkflowAutocomplete
            {...{ workflows, setWorkflows }}
            containerStyles='px-2 pb-2'
            controlSize='20rem'
          />
          <BuildingBlockAutocomplete
            {...{ buildingBlocks, setBuildingBlocks }}
            containerStyles='px-2 pb-2'
            controlSize='20rem'
          />
          <TagAutocomplete
            {...{ tags, setTags }}
            containerStyles='px-2 pb-2'
            controlSize='20rem'
          />
        </div>
        <div className='col-span-11 lg:col-span-6'>
          <div className='text-xl px-2 pb-3 pt-2'>
            {format('filter.entity', { entity: format('product.label') }).toUpperCase()}
          </div>
          <div className='text-sm flex flex-col'>
            <div className='px-2 pb-2'>
              <label className='inline-flex items-center'>
                <Checkbox onChange={toggleCovid19Tag} value={isCovid19TagActive} />
                <span className='ml-2'>
                  {format('filter.product.forCovid')}
                </span>
              </label>
            </div>
            <div className='px-2 pb-2'>
              <label className='inline-flex items-center'>
                <Checkbox onChange={toggleIsEndorsed} value={isEndorsed} />
                <span className='ml-2'>
                  {format('filter.product.endorsed')}
                </span>
              </label>
            </div>
            <div className='px-2 pb-2'>
              <label className='inline-flex items-center'>
                <Checkbox onChange={toggleProductDeployable} value={productDeployable} />
                <span className='ml-2'>
                  {format('filter.product.launchable')}
                </span>
              </label>
            </div>
          </div>
          <div className='text-sm text-dial-gray-light flex flex-row flex-wrap'>
            <LicenseTypeSelect
              {...{ licenseTypes, setLicenseTypes }}
              containerStyles='px-2 pb-2'
              controlSize='20rem'
            />
            <OriginAutocomplete
              {...{ origins, setOrigins }}
              containerStyles='px-2 pb-2'
              controlSize='20rem'
            />
            <EndorserAutocomplete
              {...{ endorsers, setEndorsers }}
              containerStyles='px-2 pb-2'
              controlSize='20rem'
            />
            <CountryAutocomplete
              {...{ countries, setCountries }}
              containerStyles='px-2 pb-2'
              controlSize='20rem'
            />
            <SectorAutocomplete
              {...{ sectors, setSectors }}
              containerStyles='px-2 pb-2'
              controlSize='20rem'
            />
            <OrganizationAutocomplete
              {...{ organizations, setOrganizations }}
              containerStyles='px-2 pb-2'
              controlSize='20rem'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductFilter
