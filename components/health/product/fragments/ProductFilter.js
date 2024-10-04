import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { FilterContext, FilterDispatchContext } from '../../../context/FilterContext'
import { SoftwareCategoryActiveFilters, SoftwareCategoryAutocomplete } from '../../shared/filter/SoftwareCategory'
import { ProductStageActiveFilters, ProductStageAutocomplete } from '../../shared/filter/ProductStage'
import ProductSearchBar from '../../product/fragments/ProductSearchBar'

const ProductFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { softwareCategories, softwareFeatures, productStage } = useContext(FilterContext)
  const { setSoftwareCategories, setSoftwareFeatures, setProductStage } = useContext(FilterDispatchContext)

  const clearFilter = () => {
    setSoftwareCategories([])
    setSoftwareFeatures([])
    setProductStage(null)
  }

  const filteringProduct = () => {
    return softwareCategories.length +
      (productStage == null ? 0 : 1) > 0
  }

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='flex flex-row gap-y-2'>
        <hr className='border-b border-dial-slate-200'/>
        <div className='w-1/2 pr-2'>
          <ProductSearchBar />
        </div>
        <div className='w-1/2 flex flex-row gap-4 pl-4'>
          <div className='text-sm py-5'>
            {format('health.filter.primary.title')}
          </div>
          <div className='w-2/5 py-3'>
            <SoftwareCategoryAutocomplete softwareCategories={softwareCategories}
              setSoftwareCategories={setSoftwareCategories} />
          </div>
          <div className='w-2/5 py-3'>
            <ProductStageAutocomplete productStage={productStage} setProductStage={setProductStage} />
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-y-2'>
      </div>
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
          <div className='flex flex-row flex-wrap gap-2 text-sm'>
            <SoftwareCategoryActiveFilters softwareCategories={softwareCategories}
              setSoftwareCategories={setSoftwareCategories}
              softwareFeatures={softwareFeatures}
              setSoftwareFeatures={setSoftwareFeatures}/>
            <ProductStageActiveFilters productStage={productStage} setProductStage={setProductStage}/>
          </div>
        </div>
      }
    </div>
  )
}

export default ProductFilter
