import classNames from 'classnames'
import { useIntl } from 'react-intl'
import { useCallback, useMemo } from 'react'
import Pill from '../../shared/Pill'
import Select from '../../shared/Select'
import { getCategoryOptions } from '../../../lib/utilities'

export const CategoryTypeSelect = ({
  categoryTypes,
  setCategoryTypes,
  containerStyles = null,
  controlSize = null,
  placeholder = null,
  isSearch = false
}) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('categoryType.label') })

  const selectCategoryType = (categoryType) => {
    setCategoryTypes([...categoryTypes.filter(({ value }) => value !== categoryType.value), categoryType])
  }

  const options = useMemo(() => getCategoryOptions(format), [format])

  const fetchOptions = async (input) => {
    return options.filter(({ label }) => label.indexOf(input) >= 0)
  }

  return (
    <div className={classNames(containerStyles)} data-testid='dataset-search'>
      <Select
        async
        aria-label={format('filter.byEntity', { entity: format('categoryType.label') })}
        cacheOptions
        defaultOptions={options}
        loadOptions={fetchOptions}
        onChange={selectCategoryType}
        placeholder={controlPlaceholder}
        value=''
        controlSize={controlSize}
        isSearch={isSearch}
      />
    </div>
  )
}

export const CategoryTypeFilters = (props) => {
  const { categoryTypes, setCategoryTypes } = props

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeCategoryType = (categoryTypeValue) => {
    setCategoryTypes(categoryTypes.filter(({ value }) => value !== categoryTypeValue))
  }

  return (
    <>
      {categoryTypes?.map((categoryType, categoryTypeIdx) => (
        <div className='py-1' key={categoryTypeIdx}>
          <Pill
            key={`filter-${categoryTypeIdx}`}
            label={`${format('categoryType.label')}: ${categoryType.label}`}
            onRemove={() => removeCategoryType(categoryType.value)}
          />
        </div>
      ))}
    </>
  )
}
