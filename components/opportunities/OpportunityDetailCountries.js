import { useIntl } from 'react-intl'
import { useState, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useApolloClient, useMutation } from '@apollo/client'
import Pill from '../shared/Pill'
import Select from '../shared/Select'
import CountryCard from '../countries/CountryCard'
import { COUNTRY_SEARCH_QUERY } from '../../queries/country'
import EditableSection from '../shared/EditableSection'
import { ToastContext } from '../../lib/ToastContext'
import { UPDATE_OPPORTUNITY_COUNTRIES } from '../../mutations/opportunity'
import { fetchSelectOptions } from '../../queries/utils'
import { useUser } from '../../lib/hooks'

const OpportunityDetailCountries = ({ opportunity, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const { user } = useUser()
  const { locale } = useRouter()
  const { showToast } = useContext(ToastContext)

  const [isDirty, setIsDirty] = useState(false)
  const [countries, setCountries] = useState(opportunity?.countries)

  const [updateOpportunityCountries, { data, loading, reset }] = useMutation(
    UPDATE_OPPORTUNITY_COUNTRIES, {
      onError: () => {
        setIsDirty(false)
        setCountries(opportunity.countries)
        showToast(format('toast.countries.update.failure'), 'error', 'top-center')
        reset()
      },
      onCompleted: (data) => {
        const { updateOpportunityCountries: response } = data
        if (response?.opportunity && response?.errors?.length === 0) {
          setIsDirty(false)
          setCountries(data.updateOpportunityCountries.opportunity.countries)
          showToast(format('toast.countries.update.success'), 'success', 'top-center')
        } else {
          setIsDirty(false)
          setCountries(opportunity.countries)
          showToast(format('toast.countries.update.failure'), 'error', 'top-center')
          reset()
        }
      }
    }
  )

  const fetchedCountriesCallback = (data) => (
    data.countries?.map((country) => ({
      label: country.name,
      value: country.id,
      slug: country.slug
    }))
  )

  const addCountry = (country) => {
    setCountries([
      ...countries.filter(({ slug }) => slug !== country.slug),
      { name: country.label, slug: country.slug }
    ])
    setIsDirty(true)
  }

  const removeCountry = (country) => {
    setCountries([...countries.filter(({ slug }) => slug !== country.slug)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateOpportunityCountries({
        variables: {
          slug: opportunity.slug,
          countrySlugs: countries.map(({ slug }) => slug)
        },
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  const onCancel = () => {
    const countries = data?.updateOpportunityCountry?.opportunity?.countries
    setCountries(countries ?? opportunity.countries)
    setIsDirty(false)
  }

  const displayModeBody = countries.length > 0
    ? (
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
        {countries.map((country, countryIdx) =>
          <CountryCard key={countryIdx} country={country} listType='list' />)
        }
      </div>
    ) : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('opportunity.no-country')}
      </div>
    )

  const editModeBody =
    <>
      <p className='card-title text-dial-stratos mb-3'>
        {format('app.assign')} {format('country.header')}
      </p>
      <label className='flex flex-col gap-y-2 mb-2' data-testid='country-search'>
        {`${format('app.searchAndAssign')} ${format('country.header')}`}
        <Select
          async
          isSearch
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) => fetchSelectOptions(client, input, COUNTRY_SEARCH_QUERY, fetchedCountriesCallback)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('country.header') })}
          onChange={addCountry}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3 mt-5'>
        {countries.map((country, countryIdx) => (
          <Pill
            key={`country-${countryIdx}`}
            label={country.name}
            onRemove={() => removeCountry(country)}
          />
        ))}
      </div>
    </>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={format('country.header')}
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
