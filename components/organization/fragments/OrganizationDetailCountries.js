import { useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import Select from '../../shared/form/Select'
import EditableSection from '../../shared/EditableSection'
import Pill from '../../shared/form/Pill'
import { fetchSelectOptions } from '../../utils/search'
import { DisplayType } from '../../utils/constants'
import { UPDATE_ORGANIZATION_COUNTRIES } from '../../shared/mutation/organization'
import CountryCard from '../../country/CountryCard'
import { COUNTRY_SEARCH_QUERY } from '../../shared/query/country'

const OrganizationDetailCountries = ({ organization, canEdit, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [countries, setCountries] = useState(organization.countries)
  const [isDirty, setIsDirty] = useState(false)

  const { user } = useUser()
  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateOrganizationCountries, { loading, reset }] = useMutation(UPDATE_ORGANIZATION_COUNTRIES, {
    onError() {
      setIsDirty(false)
      setCountries(organization?.countries)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.country.header') }))
      reset()
    },
    onCompleted: (data) => {
      const { updateOrganizationCountries: response } = data
      if (response?.organization && response?.errors?.length === 0) {
        setIsDirty(false)
        setCountries(response?.organization?.countries)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.country.header') }))
      } else {
        setIsDirty(false)
        setCountries(organization?.countries)
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
    if (user) {
      const { userEmail, userToken } = user

      updateOrganizationCountries({
        variables: {
          countrySlugs: countries.map(({ slug }) => slug),
          slug: organization.slug
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
    setCountries(organization.countries)
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
        base: format('ui.organization.label')
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
      canEdit={canEdit}
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

export default OrganizationDetailCountries
