import classNames from 'classnames'
import { useIntl } from 'react-intl'
import Pill from '../../shared/Pill'
import Select from '../../shared/Select'

export const EndorsingYearSelect = ({
  years,
  setYears,
  containerStyles = null,
  controlSize = null,
  placeholder = null,
  isSearch = false
}) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('endorsingYear.label') })

  const selectYear = (year) => {
    setYears([...years.filter(({ value }) => value !== year.value), year])
  }

  const options = (() => {
    let startYear = 2015
    const currentYear = new Date().getFullYear()

    const years = []
    while (startYear <= currentYear) {
      years.push({ value: startYear, label: startYear })
      startYear = startYear + 1
    }

    return years
  })()

  const fetchOptions = async (input) => {
    return options.filter(({ label }) => label.indexOf(input) >= 0)
  }

  return (
    <div className={classNames(containerStyles)} data-testid='endorsing-year-search'>
      <Select
        async
        aria-label={format('filter.byEntity', { entity: format('endorsingYear.label') })}
        cacheOptions
        defaultOptions={options}
        loadOptions={fetchOptions}
        onChange={selectYear}
        placeholder={controlPlaceholder}
        value=''
        controlSize={controlSize}
        isSearch={isSearch}
      />
    </div>
  )
}

export const EndorsingYearFilters = (props) => {
  const { years, setYears } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const removeYear = (yearValue) => {
    setYears(years.filter(({ value }) => value !== yearValue))
  }

  return (
    <>
      {years?.map((year, yearIdx) => (
        <div className='py-1' key={yearIdx}>
          <Pill
            key={`filter-${yearIdx}`}
            label={`${format('endorsingYear.label')}: ${year.label}`}
            onRemove={() => removeYear(year.value)}
          />
        </div>
      ))}
    </>
  )
}
