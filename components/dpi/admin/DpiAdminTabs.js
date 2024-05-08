import { useCallback } from 'react'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { FaGears, FaTowerBroadcast, FaUser, FaUserGroup } from 'react-icons/fa6'
import { useIntl } from 'react-intl'

const DpiAdminTabs = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { pathname } = useRouter()

  const  tabItems = [
    {
      name: format('ui.dpi.admin.profile'),
      href: '/dpi-admin/profile',
      icon: <FaUser className='my-auto' />
    },
    {
      name: format('ui.dpi.admin.users'),
      href: '/dpi-admin/users',
      icon: <FaUserGroup className='my-auto' />
    },
    {
      name: format('ui.dpi.admin.broadcast'),
      href: '/dpi-admin/broadcast',
      icon: <FaTowerBroadcast className='my-auto' />
    },
    {
      name: format('ui.dpi.admin.settings'),
      href: '/dpi-admin/settings',
      icon: <FaGears className='my-auto' />
    }
  ]

  return (
    <ul class="flex-column space-y space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
      {tabItems.map((item, index) => {
        return (
          <li key={`tab-${index}`}>
            <a href={item.href} key={index}
              className={classNames(
                'inline-flex items-center px-4 py-3 rounded-lg w-full',
                pathname === item.href
                  ? 'text-white active bg-blue-600'
                  : 'bg-gray-800 hover:bg-gray-700 hover:text-white'
              )}
            >
              <div className='flex gap-2'>
                {item.icon}
                {item.name}
              </div>
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export default DpiAdminTabs
