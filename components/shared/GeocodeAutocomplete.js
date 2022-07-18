import { suggest, geocode, reverseGeocode } from '@esri/arcgis-rest-geocoding'
import React, { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useArcGisToken } from '../../lib/hooks'
import Select from './Select'

const GeocodeAutocomplete = React.forwardRef(({ onChange }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { token: authentication } = useArcGisToken()

  const fetchLocationOptions = async (searchText) => {
    if (searchText !== '') {
      const response = await suggest(searchText, { authentication })

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
      const { x: longitude, y: latitude } = response.candidates[0]?.location
      const {
        address: {
          CntryName: countryName,
          CountryCode: countryCode,
          Region: regionName,
          City: cityName
        }
      } = await reverseGeocode({ longitude, latitude }, { authentication })
      onChange({ countryName, countryCode, regionName, cityName, longitude, latitude })
    } else {
      onChange(null)
    }
  }

  return (
    <Select
      ref={ref}
      async
      isSearch
      isClearable
      placeholder={format('location.select.autocomplete.defaultPlaceholder')}
      loadOptions={input => fetchLocationOptions(input)}
      noOptionsMessage={() => format('filter.searchFor', { entity: format('location.header') })}
      onChange={setLocation}
    />
  )
})

GeocodeAutocomplete.displayName = 'GeocodeAutocomplete'

export default GeocodeAutocomplete
