import { useCallback, useContext, useState } from 'react'
import { FaAngleDown, FaAngleUp, FaXmark } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { FilterContext, FilterDispatchContext } from '../../context/FilterContext'
import { BuildingBlockActiveFilters, BuildingBlockAutocomplete } from '../../shared/filter/BuildingBlock'
import { CountryActiveFilters, CountryAutocomplete } from '../../shared/filter/Country'
import { LicenseTypeActiveFilters, LicenseTypeAutocomplete } from '../../shared/filter/LicenseType'
import { OriginActiveFilters, OriginAutocomplete } from '../../shared/filter/Origin'
import { SdgActiveFilters, SdgAutocomplete } from '../../shared/filter/Sdg'
import { SectorActiveFilters, SectorAutocomplete } from '../../shared/filter/Sector'
import { TagActiveFilters, TagAutocomplete } from '../../shared/filter/Tag'
import { UseCaseActiveFilters, UseCaseAutocomplete } from '../../shared/filter/UseCase'
import { WorkflowActiveFilters, WorkflowAutocomplete } from '../../shared/filter/Workflow'
import Checkbox from '../../shared/form/Checkbox'

const COVID_19_LABEL = 'COVID-19'
const COVID_19_SLUG = 'covid19'

const ProductFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    buildingBlocks,
    countries,
    isLinkedWithDpi,
    licenseTypes,
    origins,
    sdgs,
    sectors,
    showDpgaOnly,
    showGovStackOnly,
    tags,
    useCases,
    workflows
  } = useContext(FilterContext)

  const {
    setBuildingBlocks,
    setCountries,
    setIsLinkedWithDpi,
    setLicenseTypes,
    setOrigins,
    setSdgs,
    setSectors,
    setShowDpgaOnly,
    setShowGovStackOnly,
    setTags,
    setUseCases,
    setWorkflows
  } = useContext(FilterDispatchContext)

  const [expanded, setExpanded] = useState(false)

  const toggleIsLinkedWithDpi = () => {
    setIsLinkedWithDpi(!isLinkedWithDpi)
  }

  const toggleShowGovStackOnly = () => {
    setShowGovStackOnly(!showGovStackOnly)
  }

  const toggleShowDpgaOnly = () => {
    setShowDpgaOnly(!showDpgaOnly)
  }

  const isCovid19TagActive = tags.some(({ slug }) => slug === COVID_19_SLUG)

  const toggleCovid19Tag = () => {
    const tagsWithoutCovid19 = tags.filter(({ slug }) => slug !== COVID_19_SLUG)
    setTags(isCovid19TagActive
      ? tagsWithoutCovid19
      : [
        ...tagsWithoutCovid19,
        { label: COVID_19_LABEL, value: COVID_19_LABEL, slug: COVID_19_SLUG }
      ]
    )
  }

  const clearFilter = () => {
    setIsLinkedWithDpi(false)
    setShowGovStackOnly(false)
    setShowDpgaOnly(false)

    setSdgs([])
    setUseCases([])
    setWorkflows([])
    setBuildingBlocks([])

    setCountries([])
    setOrigins([])
    setSectors([])
    setTags([])
    setLicenseTypes([])
  }

  const filteringProduct = () => {

    return isLinkedWithDpi ? 1 : 0 +
      showGovStackOnly ? 1 : 0 +
        showDpgaOnly ? 1 : 0 +
        sdgs.length +
        workflows.length +
        buildingBlocks.length +
        useCases.length +
        origins.length +
        sectors.length +
        tags.length +
        countries.length +
        licenseTypes.length > 0
  }

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      {filteringProduct() &&
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
            <UseCaseActiveFilters useCases={useCases} setUseCases={setUseCases} />
            <BuildingBlockActiveFilters buildingBlocks={buildingBlocks} setBuildingBlocks={setBuildingBlocks} />
            <SectorActiveFilters sectors={sectors} setSectors={setSectors} />
            <TagActiveFilters tags={tags} setTags={setTags} />
            <CountryActiveFilters countries={countries} setCountries={setCountries} />
            <LicenseTypeActiveFilters licenseTypes={licenseTypes} setLicenseTypes={setLicenseTypes} />
            <WorkflowActiveFilters workflows={workflows} setWorkflows={setWorkflows} />
            <SdgActiveFilters sdgs={sdgs} setSdgs={setSdgs} />
            <OriginActiveFilters origins={origins} setOrigins={setOrigins} />
            {isLinkedWithDpi && (
              <div className='bg-dial-slate-400 px-2 py-1 rounded text-white'>
                <div className='flex flex-row gap-1'>
                  <div className='flex gap-x-1'>
                    {format('filter.product.linkedWithDpi')}
                    <button type='button' onClick={toggleIsLinkedWithDpi}>
                      <FaXmark size='1rem' />
                    </button>
                  </div>
                </div>
              </div>
            )}
            {showGovStackOnly && (
              <div className='bg-dial-slate-400 text-white px-2 py-1 rounded'>
                <div className='flex flex-row gap-1'>
                  <div className='flex gap-x-1'>
                    {format('ui.product.filter.showGovStackOnly')}
                    <button type='button' onClick={toggleShowGovStackOnly}>
                      <FaXmark size='1rem' />
                    </button>
                  </div>
                </div>
              </div>
            )}
            {showDpgaOnly && (
              <div className='bg-dial-slate-400 text-white px-2 py-1 rounded'>
                <div className='flex flex-row gap-1'>
                  <div className='flex gap-x-1'>
                    {format('ui.product.filter.showDpgaOnly')}
                    <button type='button' onClick={toggleShowDpgaOnly}>
                      <FaXmark size='1rem' />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      }
      <div className='flex flex-col gap-y-2'>
        <div className='text-sm font-semibold text-dial-sapphire'>
          {format('ui.filter.primary.title')}
        </div>
        <hr className='border-b border-dial-slate-200' />
        <UseCaseAutocomplete useCases={useCases} setUseCases={setUseCases} />
        <hr className='border-b border-dial-slate-200' />
        <BuildingBlockAutocomplete buildingBlocks={buildingBlocks} setBuildingBlocks={setBuildingBlocks} />
        <hr className='border-b border-dial-slate-200' />
        <SectorAutocomplete sectors={sectors} setSectors={setSectors} />
        <hr className='border-b border-dial-slate-200' />
        <TagAutocomplete tags={tags} setTags={setTags} />
        <hr className='border-b border-dial-slate-200' />
        <label className='flex py-2'>
          <Checkbox value={isLinkedWithDpi} onChange={toggleIsLinkedWithDpi} />
          <span className='mx-2 my-auto text-sm'>
            {format('filter.product.linkedWithDpi')}
          </span>
        </label>
        <hr className='border-b border-dial-slate-200' />
      </div>
      <div className='flex flex-col gap-y-2'>
        <div className='text-sm font-semibold text-dial-sapphire'>
          <button
            type='button'
            onClick={() => setExpanded(!expanded)}
          >
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
                {format('filter.product.forCovid')}
              </span>
            </label>
            <label className='flex py-2'>
              <Checkbox onChange={toggleShowGovStackOnly} value={showGovStackOnly} />
              <span className='mx-2 my-auto text-sm'>
                {format('ui.product.filter.showGovStackOnly')}
              </span>
            </label>
            <label className='flex py-2'>
              <Checkbox onChange={toggleShowDpgaOnly} value={showDpgaOnly} />
              <span className='mx-2 my-auto text-sm'>
                {format('ui.product.filter.showDpgaOnly')}
              </span>
            </label>
            <hr className='border-b border-dial-slate-200' />
            <CountryAutocomplete countries={countries} setCountries={setCountries} />
            <hr className='border-b border-dial-slate-200' />
            <LicenseTypeAutocomplete licenseTypes={licenseTypes} setLicenseTypes={setLicenseTypes} />
            <hr className='border-b border-dial-slate-200' />
            <WorkflowAutocomplete workflows={workflows} setWorkflows={setWorkflows} />
            <hr className='border-b border-dial-slate-200' />
            <SdgAutocomplete sdgs={sdgs} setSdgs={setSdgs} />
            <hr className='border-b border-dial-slate-200' />
            <OriginAutocomplete origins={origins} setOrigins={setOrigins} />
            <hr className='border-b border-dial-slate-200' />
          </>
        }
      </div>
    </div>
  )
}

export default ProductFilter
