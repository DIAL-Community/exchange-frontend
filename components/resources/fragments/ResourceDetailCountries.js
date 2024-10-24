import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useApolloClient, useMutation } from '@apollo/client'
import { ToastContext } from '../../../lib/ToastContext'
import EditableSection from '../../shared/EditableSection'
import Pill from '../../shared/form/Pill'
import Select from '../../shared/form/Select'
import { UPDATE_RESOURCE_COUNTRIES } from '../../shared/mutation/resource'
import { COUNTRY_SEARCH_QUERY } from '../../shared/query/country'
import { fetchSelectOptions } from '../../utils/search'

const ResourceDetailCountries = ({ resource, editingAllowed, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [countries, setCountries] = useState(resource.countries)
  const [isDirty, setIsDirty] = useState(false)

  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateResourceCountries, { loading, reset }] = useMutation(UPDATE_RESOURCE_COUNTRIES, {
    onError() {
      setIsDirty(false)
      setCountries(resource?.countries)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.country.header') }))
      reset()
    },
    onCompleted: (data) => {
      const { updateResourceCountries: response } = data
      if (response?.resource && response?.errors?.length === 0) {
        setIsDirty(false)
        setCountries(response?.resource?.countries)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.country.header') }))
      } else {
        setIsDirty(false)
        setCountries(resource?.countries)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.country.header') }))
        reset()
      }
    }
  })

  const fetchedCountriesCallback = (data) => (
    data.countries?.map((country) => ({
      id: country.id,
      name: country.name,
      slug: country.slug,
      label: country.name
    }))
  )

  const addCountry = (country) => {
    setCountries([
      ...countries.filter(({ id }) => id !== country.id),
      { id: country.id, name: country.name, slug: country.slug  }
    ])
    setIsDirty(true)
  }

  const removeCountry = (country) => {
    setCountries([...countries.filter(({ id }) => id !== country.id)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    updateResourceCountries({
      variables: {
        countrySlugs: countries.map(({ slug }) => slug),
        slug: resource.slug
      },
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
  }

  const onCancel = () => {
    setCountries(resource.countries)
    setIsDirty(false)
  }

  const displayModeBody = countries.length
    ? <div className='text-dial-stratos'>
      {countries?.map(country => country.name).join(', ')}
    </div>
    : <div className='text-sm text-dial-stratos'>
      {format( 'ui.common.detail.noData', {
        entity: format('ui.country.label'),
        base: format('ui.resource.label')
      })}
    </div>

  const sectionHeader =
    <div className='font-semibold text-dial-stratos' ref={headerRef}>
      {format('ui.country.header')}
    </div>

  const editModeBody =
    <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-3 text-sm'>
      <label className='flex flex-col gap-y-2'>
        {`${format('app.searchAndAssign')} ${format('ui.country.label')}`}
        <Select
          async
          isSearch
          isBorderless
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) =>
            fetchSelectOptions(client, input, COUNTRY_SEARCH_QUERY, fetchedCountriesCallback)
          }
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.country.label') })}
          onChange={addCountry}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3'>
        {countries.map((country, countryIdx) => (
          <Pill
            key={`countries-${countryIdx}`}
            label={country.name}
            onRemove={() => removeCountry(country)}
          />
        ))}
      </div>
    </div>

  return (
    <EditableSection
      editingAllowed={editingAllowed}
      sectionHeader={sectionHeader}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isDirty={isDirty}
      isMutating={loading}
      displayModeBody={displayModeBody}
      editModeBody={editModeBody}
    />
  )
}

export default ResourceDetailCountries
