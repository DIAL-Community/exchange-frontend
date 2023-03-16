import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { MAPPED_FILTER_ITEMS_URL } from './context/FilterContext'
import Select from './shared/Select'

const NavigationSelection = ({ activeTab }) => {
  const router = useRouter()

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const onChangeHandler = (selectedValue) => {
    router.push(`/${selectedValue.value}`)
  }

  const currentValue = { value: MAPPED_FILTER_ITEMS_URL[activeTab], label: format(activeTab) }

  const navOptions =
    Object
      .keys(MAPPED_FILTER_ITEMS_URL)
      .map(key => ({ value: MAPPED_FILTER_ITEMS_URL[key], label: format(key) }))

  return (
    <label className='flex flex-col gap-y-2'>
      <span className='text-sm font-semibold'>
        {format('app.selectNavigation')}
      </span>
      <Select
        options={navOptions}
        onChange={onChangeHandler}
        value={currentValue}
      />
    </label>
  )
}

export default NavigationSelection
