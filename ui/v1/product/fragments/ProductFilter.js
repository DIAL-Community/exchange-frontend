import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { FaXmark } from 'react-icons/fa6'
import { FaAngleUp, FaAngleDown } from 'react-icons/fa6'
import {
  ProductFilterContext,
  ProductFilterDispatchContext
} from '../../../../components/context/ProductFilterContext'
import { TagActiveFilters, TagAutocomplete } from '../../shared/filter/Tag'
import { LicenseTypeActiveFilters, LicenseTypeAutocomplete } from '../../shared/filter/LicenseType'
import { OriginActiveFilters, OriginAutocomplete } from '../../shared/filter/Origin'
import { SectorActiveFilters, SectorAutocomplete } from '../../shared/filter/Sector'
import { WorkflowActiveFilters, WorkflowAutocomplete } from '../../shared/filter/Workflow'
import { UseCaseActiveFilters, UseCaseAutocomplete } from '../../shared/filter/UseCase'
import { SdgActiveFilters, SdgAutocomplete } from '../../shared/filter/Sdg'
import { BuildingBlockAutocomplete, BuildingBlockActiveFilters } from '../../shared/filter/BuildingBlock'
import Checkbox from '../../shared/form/Checkbox'

const COVID_19_LABEL = 'COVID-19'

const ProductFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { useCases, buildingBlocks, sectors, tags } = useContext(ProductFilterContext)
  const { setUseCases, setBuildingBlocks, setSectors, setTags } = useContext(ProductFilterDispatchContext)

  const { licenseTypes, sdgs, origins, workflows } = useContext(ProductFilterContext)
  const { setLicenseTypes, setSdgs, setOrigins, setWorkflows } = useContext(ProductFilterDispatchContext)

  const { isLinkedWithDpi } = useContext(ProductFilterContext)
  const { setIsLinkedWithDpi } = useContext(ProductFilterDispatchContext)

  const [expanded, setExpanded] = useState(false)

  const toggleIsLinkedWithDpi = () => {
    setIsLinkedWithDpi(!isLinkedWithDpi)
  }

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

    setIsLinkedWithDpi(false)

    setSdgs([])
    setUseCases([])
    setWorkflows([])
    setBuildingBlocks([])

    setOrigins([])
    setSectors([])
    setTags([])
    setLicenseTypes([])
  }

  const filteringProduct = () => {

    return isLinkedWithDpi ? 1 : 0 +
      sdgs.length +
      workflows.length +
      buildingBlocks.length +
      useCases.length +
      origins.length +
      sectors.length +
      tags.length +
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
          </div>
        </div>
      }
      <div className='flex flex-col gap-y-2'>
        <div className='text-sm font-semibold text-dial-sapphire'>
          {format('ui.filter.primary.title')}
        </div>
        <hr className='border-b border-dial-slate-200'/>
        <UseCaseAutocomplete useCases={useCases} setUseCases={setUseCases} />
        <hr className='border-b border-dial-slate-200'/>
        <BuildingBlockAutocomplete buildingBlocks={buildingBlocks} setBuildingBlocks={setBuildingBlocks} />
        <hr className='border-b border-dial-slate-200'/>
        <SectorAutocomplete sectors={sectors} setSectors={setSectors} />
        <hr className='border-b border-dial-slate-200'/>
        <TagAutocomplete tags={tags} setTags={setTags} />
        <hr className='border-b border-dial-slate-200'/>
        <label className='flex py-2'>
          <Checkbox value={isLinkedWithDpi} onChange={toggleIsLinkedWithDpi} />
          <span className='mx-2 my-auto text-sm'>
            {format('filter.product.linkedWithDpi')}
          </span>
        </label>
        <hr className='border-b border-dial-slate-200'/>
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
            <hr className='border-b border-dial-slate-200'/>
            <LicenseTypeAutocomplete licenseTypes={licenseTypes} setLicenseTypes={setLicenseTypes} />
            <hr className='border-b border-dial-slate-200'/>
            <WorkflowAutocomplete workflows={workflows} setWorkflows={setWorkflows} />
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

export default ProductFilter
