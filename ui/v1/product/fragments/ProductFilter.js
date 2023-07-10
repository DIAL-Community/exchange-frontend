import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { ProductFilterContext, ProductFilterDispatchContext }
  from '../../../../components/context/ProductFilterContext'
import { TagActiveFilters, TagAutocomplete } from '../../shared/filter/Tag'
import { LicenseTypeActiveFilters, LicenseTypeAutocomplete } from '../../shared/filter/LicenseType'
import { OriginActiveFilters, OriginAutocomplete } from '../../shared/filter/Origin'
import { SectorActiveFilters, SectorAutocomplete } from '../../shared/filter/Sector'
import { WorkflowActiveFilters, WorkflowAutocomplete } from '../../shared/filter/Workflow'
import { UseCaseActiveFilters, UseCaseAutocomplete } from '../../shared/filter/UseCase'
import { SdgActiveFilters, SdgAutocomplete } from '../../shared/filter/Sdg'

const ProductFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { origins, sectors, tags, licenseTypes } = useContext(ProductFilterContext)
  const { setOrigins, setSectors, setTags, setLicenseTypes } = useContext(ProductFilterDispatchContext)

  const { sdgs, useCases, workflows, buildingBlocks } = useContext(ProductFilterContext)
  const { setSdgs, setUseCases, setWorkflows, setBuildingBlocks } = useContext(ProductFilterDispatchContext)

  const clearFilter = (e) => {
    e.preventDefault()

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
    return sdgs.length +
      workflows.length +
      buildingBlocks +
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
              <button onClick={clearFilter}>
                {format('ui.filter.clearAll')}
              </button>
            </div>
          </div>
          <div className='flex flex-row flex-wrap gap-1 text-sm'>
            <SdgActiveFilters sdgs={sdgs} setSdgs={setSdgs} />
            <UseCaseActiveFilters useCases={useCases} setUseCases={setUseCases} />
            <WorkflowActiveFilters workflows={workflows} setWorkflows={setWorkflows} />
            <OriginActiveFilters origins={origins} setOrigins={setOrigins} />
            <LicenseTypeActiveFilters licenseTypes={licenseTypes} setLicenseTypes={setLicenseTypes} />
            <SectorActiveFilters sectors={sectors} setSectors={setSectors} />
            <TagActiveFilters tags={tags} setTags={setTags} />
          </div>
        </div>
      }
      <div className='flex flex-col gap-y-4'>
        <div className='text-sm font-semibold text-dial-sapphire'>
          {format('ui.filter.title')}
        </div>
        <SdgAutocomplete sdgs={sdgs} setSdgs={setSdgs} />
        <hr className='bg-slate-200'/>
        <UseCaseAutocomplete useCases={useCases} setUseCases={setUseCases} />
        <hr className='bg-slate-200'/>
        <WorkflowAutocomplete workflows={workflows} setWorkflows={setWorkflows} />
        <hr className='bg-slate-200'/>
      </div>
      <div className='flex flex-col gap-y-4'>
        <div className='text-sm font-semibold text-dial-sapphire'>
          {format('ui.filter.subtitle', { entity: format('ui.product.label').toLowerCase() })}:
        </div>
        <LicenseTypeAutocomplete licenseTypes={licenseTypes} setLicenseTypes={setLicenseTypes} />
        <hr className='bg-slate-200'/>
        <OriginAutocomplete origins={origins} setOrigins={setOrigins} />
        <hr className='bg-slate-200'/>
        <SectorAutocomplete sectors={sectors} setSectors={setSectors} />
        <hr className='bg-slate-200'/>
        <TagAutocomplete tags={tags} setTags={setTags} />
      </div>
    </div>
  )
}

export default ProductFilter
