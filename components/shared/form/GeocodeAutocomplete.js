import React, { useCallback, useMemo } from 'react'
import { FaSpinner } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { geocode, reverseGeocode, suggest } from '@esri/arcgis-rest-geocoding'
import { useArcGisToken } from '../../../lib/hooks'
import { COUNTRY_CODES_QUERY } from '../query/country'
import Select from './Select'

const GeocodeAutocomplete = React.forwardRef(({ value, onChange }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading: loadingCountries, data: countryData } = useQuery(COUNTRY_CODES_QUERY, { variables: { search: '' } })

  const countryCodes = useMemo(
    () => countryData?.countries?.filter(({ codeLonger }) => !!codeLonger)?.map(({ codeLonger }) => codeLonger),
    [countryData]
  )

  const { token: authentication } = useArcGisToken()

  const fetchLocationOptions = async (searchText) => {

    if (searchText !== '') {
      const response = await suggest(searchText, { authentication, params: { countryCode: countryCodes } })

      return response?.suggestions?.map(({ text, magicKey }) => ({
        value: magicKey,
        label: text
      }))
    }

    return []
  }

  const setLocation = async (suggestion) => {
    if (suggestion) {
      const response = await geocode({ magicKey: suggestion.value, authentication })
      const [candidate] = response.candidates
      if (candidate) {
        const { x: longitude, y: latitude } = candidate.location
        const {
          address: {
            CountryName: countryName,
            CountryCode: countryCode,
            Region: regionName,
            City: cityName
          }
        } = await reverseGeocode({ longitude, latitude }, { authentication })
        onChange({ countryName, countryCode, regionName, cityName, longitude, latitude })
      }
    }
  }

  return (
    loadingCountries
      ? <FaSpinner size='2em' className='spinner' />
      : <Select
        ref={ref}
        async
        isSearch
        placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
        loadOptions={input => fetchLocationOptions(input)}
        noOptionsMessage={() => format('filter.searchFor', { entity: format('location.header') })}
        onChange={setLocation}
        value={value}
        className='max-w-[48vw]'
      />
  )
})

GeocodeAutocomplete.displayName = 'GeocodeAutocomplete'

export default GeocodeAutocomplete
