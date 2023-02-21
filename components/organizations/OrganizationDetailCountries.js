import { useIntl } from 'react-intl'
import { useState, useEffect, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import { useApolloClient, useMutation } from '@apollo/client'
import Pill from '../shared/Pill'
import Select from '../shared/Select'
import CountryCard from '../countries/CountryCard'
import { COUNTRY_SEARCH_QUERY } from '../../queries/country'
import EditableSection from '../shared/EditableSection'
import { ToastContext } from '../../lib/ToastContext'
import { UPDATE_ORGANIZATION_COUNTRY } from '../../mutations/organization'
import { fetchSelectOptions } from '../../queries/utils'
import { useUser } from '../../lib/hooks'

const OrganizationDetailCountries = ({ organization, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [countries, setCountries] = useState(organization.countries)

  const [isDirty, setIsDirty] = useState(false)

  const [updateOrganizationCountry, { data, loading }] = useMutation(UPDATE_ORGANIZATION_COUNTRY)

  const { user } = useUser()

  const { locale } = useRouter()

  const { showToast } = useContext(ToastContext)

  useEffect(() => {
    if (data?.updateOrganizationCountry?.errors.length === 0 && data?.updateOrganizationCountry?.organization) {
      setCountries(data.updateOrganizationCountry.organization.countries)
      setIsDirty(false)
      showToast(format('organization.countries.updated'), 'success', 'top-center')
    }
  }, [data, showToast, format])

  const fetchedCountriesCallback = (data) => (
    data.countries?.map((country) => ({
      label: country.name,
      value: country.id,
      slug: country.slug
    }))
  )

  const addCountry = (country) => {
    setCountries([...countries.filter(({ slug }) => slug !== country.slug), { name: country.label, slug: country.slug }])
    setIsDirty(true)
  }

  const removeCountry = (country) => {
    setCountries([...countries.filter(({ slug }) => slug !== country.slug)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateOrganizationCountry({
        variables: {
          slug: organization.slug,
          countriesSlugs: countries.map(({ slug }) => slug)
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
    setCountries(data?.updateOrganizationCountry?.organization?.countries ?? organization.countries)
    setIsDirty(false)
  }

  const displayModeBody = countries.length > 0
    ? (
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
        {countries.map((country, countryIdx) => <CountryCard key={countryIdx} country={country} listType='list' />)}
      </div>
    ) : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('organization.no-country')}
      </div>
    )

  const editModeBody =
    <>
      <p className='card-title text-dial-blue mb-3'>
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

export default OrganizationDetailCountries
