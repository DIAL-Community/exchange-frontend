import classNames from 'classnames'
import { useIntl } from 'react-intl'
import { useCallback, useMemo } from 'react'
import Pill from '../../shared/Pill'
import Select from '../../shared/Select'
import { getSpecialtyOptions } from '../../../lib/utilities'

export const SpecialtySelect = ({
  specialties,
  setSpecialties,
  containerStyles = null,
  controlSize = null,
  placeholder = null,
  isSearch = false
}) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('specialty.label') })

  const selectSpecialty = (specialty) => {
    setSpecialties([...specialties.filter(({ value }) => value !== specialty.value), specialty])
  }

  const options = useMemo(() => getSpecialtyOptions(format), [format])

  const fetchOptions = async (input) => {
    return options.filter(({ label }) => label.indexOf(input) >= 0)
  }

  return (
    <div className={classNames(containerStyles)} data-testid='dataset-search'>
      <Select
        async
        aria-label={format('filter.byEntity', { entity: format('specialty.label') })}
        className='rounded text-sm text-dial-gray-dark my-auto'
        cacheOptions
        defaultOptions={options}
        loadOptions={fetchOptions}
        onChange={selectSpecialty}
        placeholder={controlPlaceholder}
        value=''
        controlSize={controlSize}
        isSearch={isSearch}
      />
    </div>
  )
}

export const SpecialtyFilters = (props) => {
  const { specialties, setSpecialties } = props

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const removeSpecialty = (specialtyValue) => {
    setSpecialties(specialties.filter(({ value }) => value !== specialtyValue))
  }

  return (
    <>
      {specialties?.map((specialty, specialtyIdx) => (
        <div className='py-1' key={specialtyIdx}>
          <Pill
            key={`filter-${specialtyIdx}`}
            label={`${format('specialty.label')}: ${specialty.label}`}
            onRemove={() => removeSpecialty(specialty.value)}
          />
        </div>
      ))}
    </>
  )
}
