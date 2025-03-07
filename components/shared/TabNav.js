import { useCallback } from 'react'
import classNames from 'classnames'
import { useIntl } from 'react-intl'
import { useUser } from '../../lib/hooks'

const TabNav = ({ tabNames, activeTab, setActiveTab, exportJsonFn, exportCsvFn, createFn }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()

  const handleTabClicked = (e, index) => {
    e.preventDefault()
    if (setActiveTab) {
      setActiveTab(index)
    }
  }

  const exportCsvClicked = (e) => {
    e.preventDefault()
    if (user && exportCsvFn) {
      exportCsvFn()
    }
  }

  const exportJsonClicked = (e) => {
    e.preventDefault()
    if (user && exportJsonFn) {
      exportJsonFn()
    }
  }

  const createClicked = (e) => {
    e.preventDefault()
    if (user && createFn) {
      createFn()
    }
  }

  return (
    <div className='sticky-under-ribbon bg-white z-30'>
      <div className='px-4 lg:px-8 xl:px-24 3xl:px-56'>
        <div className='flex flex-row gap-3'>
          <ul className='flex flex-row list-none gap-x-1'>
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
                <a
                  href='#'
                  className='h-full'
                  onClick={(e) => handleTabClicked(e, index)}
                >
                  <div className='px-4 py-3 h-full'>
                    {format(tabName)}
                  </div>
                </a>
              </li>
            })}
          </ul>
          <div className='hidden lg:block ml-auto my-auto'>
            <div className='text-xs text-white font-semibold'>
              <div className='flex flex-row gap-x-2'>
                {createFn &&
                  activeTab == 0 &&
                  user && !user?.isAdminUser &&
                  <div className='bg-dial-iris-blue rounded-md'>
                    <a href='#' onClick={createClicked}>
                      <div className='px-5 py-1.5'>
                        {format('app.create').toUpperCase()}
                      </div>
                    </a>
                  </div>
                }
                {exportJsonFn &&
                  activeTab == 0 &&
                  user &&
                  <div className='bg-dial-iris-blue rounded-md'>
                    <a href='#' onClick={exportJsonClicked}>
                      <div className='px-5 py-1.5'>
                        {format('ui.shared.exportJson').toUpperCase()}
                      </div>
                    </a>
                  </div>
                }
                {exportCsvFn &&
                  activeTab == 0 &&
                  user &&
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
          </div>
        </div>
        <div className='shadow-md-lg'>
          <div className='border-b-8 border-dial-slate-500' />
        </div>
        {activeTab === 0 &&
          user &&
          <div className='block lg:hidden ml-auto my-3'>
            <div className='text-xs text-white font-semibold'>
              <div className='flex flex-row gap-x-2'>
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
          </div>
        }
      </div>
    </div>
  )
}

export default TabNav
