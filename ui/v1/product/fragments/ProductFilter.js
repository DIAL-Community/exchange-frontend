import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { ProductFilterContext, ProductFilterDispatchContext }
  from '../../../../components/context/ProductFilterContext'
import { TagActiveFilters, TagAutocomplete } from '../../shared/filter/Tag'

const ProductFilter = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { origins, sectors, tags, licenseTypes } = useContext(ProductFilterContext)
  const { setOrigins, setSectors, setTags, setLicenseTypes } = useContext(ProductFilterDispatchContext)

  const clearFilter = (e) => {
    e.preventDefault()

    setOrigins([])
    setSectors([])
    setTags([])
    setLicenseTypes([])
  }

  const filteringProduct = () => {
    return origins.length + sectors.length + tags.length + licenseTypes.length > 0
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
            <TagActiveFilters tags={tags} setTags={setTags} />
          </div>
        </div>
      }
      <div className='flex flex-col gap-y-4'>
        <div className='text-sm font-semibold text-dial-sapphire'>
          {format('ui.filter.title')}
        </div>
        <hr className='bg-slate-200'/>
        <TagAutocomplete tags={tags} setTags={setTags} />
      </div>
    </div>
  )
}

export default ProductFilter
