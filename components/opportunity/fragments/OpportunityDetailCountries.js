import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useApolloClient, useMutation } from '@apollo/client'
import { ToastContext } from '../../../lib/ToastContext'
import CountryCard from '../../country/CountryCard'
import EditableSection from '../../shared/EditableSection'
import Pill from '../../shared/form/Pill'
import Select from '../../shared/form/Select'
import { UPDATE_OPPORTUNITY_COUNTRIES } from '../../shared/mutation/opportunity'
import { COUNTRY_SEARCH_QUERY } from '../../shared/query/country'
import { DisplayType } from '../../utils/constants'
import { fetchSelectOptions } from '../../utils/search'

const OpportunityDetailCountries = ({ opportunity, editingAllowed, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [countries, setCountries] = useState(opportunity.countries)
  const [isDirty, setIsDirty] = useState(false)

  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateOpportunityCountries, { loading, reset }] = useMutation(UPDATE_OPPORTUNITY_COUNTRIES, {
    onError() {
      setIsDirty(false)
      setCountries(opportunity?.countries)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.country.header') }))
      reset()
    },
    onCompleted: (data) => {
      const { updateOpportunityCountries: response } = data
      if (response?.opportunity && response?.errors?.length === 0) {
        setIsDirty(false)
        setCountries(response?.opportunity?.countries)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.country.header') }))
      } else {
        setIsDirty(false)
        setCountries(opportunity?.countries)
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
      ...[
        ...countries.filter(({ id }) => id !== country.id),
        { id: country.id, name: country.name, slug: country.slug  }
      ]
    ])
    setIsDirty(true)
  }

  const removeCountry = (country) => {
    setCountries([...countries.filter(({ id }) => id !== country.id)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    updateOpportunityCountries({
      variables: {
        countrySlugs: countries.map(({ slug }) => slug),
        slug: opportunity.slug
      },
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
  }

  const onCancel = () => {
    setCountries(opportunity.countries)
    setIsDirty(false)
  }

  const displayModeBody = countries.length
    ? <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3'>
      {countries?.map((country, index) =>
        <div key={`country-${index}`}>
          <CountryCard country={country} displayType={DisplayType.SMALL_CARD} />
        </div>
      )}
    </div>
    : <div className='text-sm text-dial-stratos'>
      {format( 'ui.common.detail.noData', {
        entity: format('ui.country.label'),
        base: format('ui.opportunity.label')
      })}
    </div>

  const sectionHeader =
    <div className='text-xl font-semibold text-dial-plum' ref={headerRef}>
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

export default OpportunityDetailCountries
