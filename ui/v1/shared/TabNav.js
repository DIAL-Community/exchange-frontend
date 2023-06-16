import classNames from 'classnames'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'

const TabNav = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const active = 0
  const [categories] = useState(['Use cases', 'What is a use case?', 'Create a new use case'])

  return (
    <div className='px-32 sticky-under-ribbon'>
      <ul className='flex flex-row list-none pt-2 gap-x-2'>
        {categories.map((category, index) => {
          return <li
            key={`tab-menu-${category}`}
            className={classNames(
              'rounded-t px-4 py-3 text-sm',
              index === active
                ? 'text-white bg-dial-slate-500'
                : 'bg-dial-slate-300 text-dial-slate-500'
            )}
          >
            {format(category)}
          </li>
        })}
      </ul>
      <div className='shadow-md-lg'>
        <div className='border-b-8 border-dial-slate-500' />
      </div>
    </div>
  )
}

export default TabNav
