import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { ProductFilterContext, ProductFilterDispatchContext } from '../../context/ProductFilterContext'
import { SoftwareCategoryActiveFilters, SoftwareCategoryAutocomplete } from '../../shared/filter/SoftwareCategory'

const ProductFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { softwareCategories, softwareFeatures } = useContext(ProductFilterContext)
  const { setSoftwareCategories, setSoftwareFeatures } = useContext(ProductFilterDispatchContext)

  const clearFilter = () => {
    setSoftwareCategories([])
    setSoftwareFeatures([])
  }

  const filteringProduct = () => {
    return (softwareCategories.length || softwareFeatures.length) ? true : null
  }

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className='flex flex-col gap-y-2'>
        <div className='text-sm font-semibold text-dial-sapphire'>
          {format('ui.filter.primary.title')}
        </div>
        <hr className='border-b border-dial-slate-200'/>
        <SoftwareCategoryAutocomplete softwareCategories={softwareCategories}
          setSoftwareCategories={setSoftwareCategories} />
        <hr className='border-b border-dial-slate-200'/>
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
          <div className='flex flex-row flex-wrap gap-1 text-sm'>
            <SoftwareCategoryActiveFilters softwareCategories={softwareCategories}
              setSoftwareCategories={setSoftwareCategories}
              softwareFeatures={softwareFeatures}
              setSoftwareFeatures={setSoftwareFeatures} />
          </div>
        </div>
      }
    </div>
  )
}

export default ProductFilter
