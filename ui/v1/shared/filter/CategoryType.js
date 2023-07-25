import { useIntl } from 'react-intl'
import { useCallback, useMemo, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { BsPlus } from 'react-icons/bs'
import Select from '../form/Select'
import { generateCategoryTypeOptions } from '../form/options'

export const CategoryTypeAutocomplete = ({ categoryTypes, setCategoryTypes, placeholder }) => {
  const [showFilter, setShowFilter] = useState(false)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('categoryType.label') })

  const selectCategoryType = (categoryType) => {
    setCategoryTypes([...categoryTypes.filter(({ value }) => value !== categoryType.value), categoryType])
  }

  const options = useMemo(() => generateCategoryTypeOptions(format), [format])

  const loadOptions = async (input) => {
    return options.filter(({ label }) => label.indexOf(input) >= 0)
  }

  return (
    <div className='flex flex-col gap-y-3'>
      <button className='flex' onClick={() => setShowFilter(!showFilter)}>
        <div className='text-dial-stratos text-sm ml-4'>
          {format('ui.categoryType.label')}
        </div>
        <BsPlus className='ml-auto' />
      </button>
      {showFilter &&
        <Select
          async
          isBorderless
          aria-label={format('filter.byEntity', { entity: format('ui.categoryType.label') })}
          className='ml-4 rounded text-sm text-dial-gray-dark my-auto'
          cacheOptions
          defaultOptions
          loadOptions={loadOptions}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.categoryType.label') })}
          onChange={selectCategoryType}
          placeholder={controlPlaceholder}
          value=''
        />
      }
    </div>
  )
}

export const CategoryTypeActiveFilters = ({ categoryTypes, setCategoryTypes }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeCategoryType = (categoryTypeSlug) => {
    setCategoryTypes(categoryTypes => [
      ...categoryTypes.filter(categoryType => categoryType.value !== categoryTypeSlug)
    ])
  }

  return (
    <>
      {categoryTypes?.map((categoryType, categoryTypeIndex) => (
        <div key={categoryTypeIndex} className='bg-dial-slate-400 px-2 py-1 rounded'>
          <div className='flex flex-row gap-1'>
            <div className='text-white'>
              {categoryType.label}
              <div className='mx-2 inline opacity-40'>
                ({format('ui.categoryType.label')})
              </div>
            </div>
            <button onClick={() => removeCategoryType(categoryType.value)}>
              <IoClose size='1rem' className='text-white' />
            </button>
          </div>
        </div>
      ))}
    </>
  )
}
