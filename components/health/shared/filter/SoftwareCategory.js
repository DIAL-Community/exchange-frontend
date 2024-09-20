import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { FaXmark } from 'react-icons/fa6'
import { useApolloClient } from '@apollo/client'
import Select from '../form/Select'
import { fetchSelectOptions } from '../../../utils/search'
import { SOFTWARE_CATEGORY_SEARCH_QUERY } from '../../../shared/query/softwareCategory'

export const SoftwareCategoryAutocomplete = ({ softwareCategories, setSoftwareCategories, placeholder }) => {
  const client = useApolloClient()

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const controlPlaceholder = placeholder ?? format('ui.category.label')

  const selectSoftwareCategory = (category) => {
    setSoftwareCategories([...softwareCategories.filter(s => s.value !== category.value), category])
  }

  const fetchCallback = (data) => (
    data?.softwareCategories.map((category) => ({
      id: category.id,
      label: category.name,
      value: category.id,
      slug: category.slug,
      softwareFeatures: category.softwareFeatures
    }))
  )

  return (
    <div className='flex flex-col gap-y-3'>
      <Select
        async
        isBorderless
        aria-label={format('ui.category.label') }
        className='rounded text-sm text-white my-auto'
        cacheOptions
        defaultOptions
        loadOptions={(input) => fetchSelectOptions(client, input, SOFTWARE_CATEGORY_SEARCH_QUERY, fetchCallback)}
        noOptionsMessage={() => format('ui.category.label') }
        onChange={selectSoftwareCategory}
        placeholder={controlPlaceholder}
        value=''
      />
    </div>
  )
}

export const SoftwareCategoryActiveFilters =
({ softwareCategories, setSoftwareCategories, softwareFeatures, setSoftwareFeatures }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeSoftwareCategory = (categorySlug) => {
    setSoftwareCategories(softwareCategories => [...softwareCategories.filter(category => category.slug !== categorySlug)])
  }

  const featureOptions = (input) => {
    const currCategory = softwareCategories.filter(({ id }) => id === input.id)

    return currCategory && currCategory[0].softwareFeatures?.map((feature) => ({
      id: feature.id,
      name: feature.name,
      slug: feature.slug,
      label: feature.name,
      value: feature.id,
      categoryId: currCategory[0].id
    }))
  }

  const selectSoftwareFeature = (feature) => {
    setSoftwareFeatures([...softwareFeatures.filter(s => s.value !== feature.value), feature])
  }

  const removeSoftwareFeature = (featureSlug) => {
    setSoftwareFeatures(softwareFeatures => [...softwareFeatures.filter(feature => feature.slug !== featureSlug)])
  }

  return (
    <>
      {softwareCategories?.map((category, categoryIndex) => (
        <div key={categoryIndex} className='bg-health-light-gray px-2 py-1 rounded'>
          <div className='flex flex-row gap-1'>
            <div className='text-sm'>
              {category.label}
              <div className='mx-2 inline opacity-40'>
                ({format('ui.category.label')})
              </div>
            </div>
            <button onClick={() => removeSoftwareCategory(category.slug)}>
              <FaXmark size='1rem' />
            </button>
          </div>
          <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-3 text-sm col-span-2'>
            <label className='flex flex-col gap-y-2'>
              {`${format('filter.byEntity', { entity: format('ui.feature.label') })}`}
              <Select
                isBorderless
                defaultOptions
                aria-label={format('filter.byEntity', { entity: format('ui.feature.label') })}
                className='rounded text-sm text-dial-gray-dark my-auto'
                placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
                options={featureOptions(category)}
                noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.feature.label') })}
                onChange={selectSoftwareFeature}
                value=''
              />
            </label>
            <div className='flex flex-wrap flex-col gap-3'>
              {softwareFeatures.filter((feature) => feature.categoryId == category.id).map((feature, featureIdx) => (
                <div key={featureIdx} className='bg-dial-slate-400 px-2 py-1 rounded'>
                  <div className='flex flex-row gap-1'>
                    <div className='text-white'>
                      {feature.name}
                      <div className='mx-2 inline opacity-40'>
                        ({format('ui.feature.label')})
                      </div>
                    </div>
                    <button onClick={() => removeSoftwareFeature(feature.slug)}>
                      <FaXmark size='1rem' className='text-white' />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
