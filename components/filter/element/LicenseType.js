import classNames from 'classnames'
import { useIntl } from 'react-intl'
import { useCallback, useMemo } from 'react'
import Pill from '../../shared/Pill'
import Select from '../../shared/Select'
import { getLicenseTypeOptions } from '../../../lib/utilities'

export const LicenseTypeSelect = ({
  licenseTypes,
  setLicenseTypes,
  containerStyles = null,
  controlSize = null,
  placeholder = null,
  isSearch = false
}) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('licenseType.label') })

  const selectLicenseType = (licenseType) => {
    setLicenseTypes([...licenseTypes.filter(({ value }) => value !== licenseType.value), licenseType])
  }

  const options = useMemo(() => getLicenseTypeOptions(format), [format])

  const fetchOptions = async (input) => {
    return options.filter(({ label }) => label.indexOf(input) >= 0)
  }

  return (
    <div className={classNames(containerStyles)} data-testid='dataset-search'>
      <Select
        async
        aria-label={format('filter.byEntity', { entity: format('licenseType.label') })}
        cacheOptions
        defaultOptions={options}
        loadOptions={fetchOptions}
        onChange={selectLicenseType}
        placeholder={controlPlaceholder}
        value=''
        controlSize={controlSize}
        isSearch={isSearch}
      />
    </div>
  )
}

export const LicenseTypeFilters = (props) => {
  const { licenseTypes, setLicenseTypes } = props

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeLicenseType = (licenseTypeValue) => {
    setLicenseTypes(licenseTypes.filter(({ value }) => value !== licenseTypeValue))
  }

  return (
    <>
      {licenseTypes?.map((licenseType, licenseTypeIdx) => (
        <div className='py-1' key={licenseTypeIdx}>
          <Pill
            key={`filter-${licenseTypeIdx}`}
            label={`${format('licenseType.label')}: ${licenseType.label}`}
            onRemove={() => removeLicenseType(licenseType.value)}
          />
        </div>
      ))}
    </>
  )
}
