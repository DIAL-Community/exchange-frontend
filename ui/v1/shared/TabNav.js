import classNames from 'classnames'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'

const TabNav = ({ tabNames, exportJson = true, exportCsv = true }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)
  const [categories] = useState(tabNames)

  const handleTabClicked = (e, index) => {
    e.preventDefault()
    setActiveTab(index)
  }

  const exportCsvClicked = (e) => {
    e.preventDefault()
  }

  const exportJsonClicked = (e) => {
    e.preventDefault()
  }

  return (
    <div className='px-48 sticky-under-ribbon'>
      <div className='flex flex-row'>
        <ul className='flex flex-row list-none pt-2 gap-x-1'>
          {categories.map((category, index) => {
            return <li
              key={`tab-menu-${category}`}
              className={classNames(
                'rounded-t text-sm',
                index === activeTab
                  ? 'text-white bg-dial-slate-500'
                  : 'bg-dial-slate-300 text-dial-slate-500'
              )}
            >
              <a href='#' onClick={(e) => handleTabClicked(e, index)}>
                <div className='px-4 py-3'>
                  {format(category)}
                </div>
              </a>
            </li>
          })}
        </ul>
        <div className='ml-auto flex flex-row gap-x-2 my-auto text-xs text-white font-bold'>
          {exportJson &&
            <div className='bg-dial-iris-blue rounded-md'>
              <a href='#' onClick={exportJsonClicked}>
                <div className='px-5 py-1.5'>
                  {format('ui.shared.exportJson').toUpperCase()}
                </div>
              </a>
            </div>
          }
          {exportCsv &&
            <div className='bg-dial-iris-blue rounded-md'>
              <a href='#' onClick={exportCsvClicked}>
                <div className='px-5 py-1.5'>
                  {format('ui.shared.exportCsv').toUpperCase()}
                </div>
              </a>
            </div>
          }
        </div>
      </div>
      <div className='shadow-md-lg'>
        <div className='border-b-8 border-dial-slate-500' />
      </div>
    </div>
  )
}

export default TabNav
