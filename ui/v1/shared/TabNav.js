import classNames from 'classnames'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'

const TabNav = ({ tabNames, activeTab, setActiveTab, exportJsonFn, exportCsvFn }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const handleTabClicked = (e, index) => {
    e.preventDefault()
    setActiveTab(index)
  }

  const exportCsvClicked = (e) => {
    e.preventDefault()
    exportCsvFn()
  }

  const exportJsonClicked = (e) => {
    e.preventDefault()
    exportJsonFn()
  }

  return (
    <div className='px-8 xl:px-56 sticky-under-ribbon bg-white z-30'>
      <div className='flex flex-row'>
        <ul className='flex flex-row list-none pt-2 gap-x-1'>
          {tabNames.map((tabName, index) => {
            return <li
              key={`tab-menu-${tabName}`}
              className={classNames(
                'rounded-t text-sm',
                index === activeTab
                  ? 'text-white bg-dial-slate-500'
                  : 'bg-dial-slate-300 text-dial-slate-500'
              )}
            >
              <a href='#' onClick={(e) => handleTabClicked(e, index)}>
                <div className='px-4 py-3'>
                  {format(tabName)}
                </div>
              </a>
            </li>
          })}
        </ul>
        <div className='ml-auto flex flex-row gap-x-2 my-auto text-xs text-white font-semibold'>
          {exportJsonFn &&
            <div className='bg-dial-iris-blue rounded-md'>
              <a href='#' onClick={exportJsonClicked}>
                <div className='px-5 py-1.5'>
                  {format('ui.shared.exportJson').toUpperCase()}
                </div>
              </a>
            </div>
          }
          {exportCsvFn &&
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
