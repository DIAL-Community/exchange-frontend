import { useCallback } from 'react'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { SUPPORTING_NAVIGATION_ITEMS, TOOL_NAVIGATION_ITEMS } from '../../utils/header'
import { CATALOG_MENU, MenuHeader } from './MenuCommon'
import { DEFAULT_DROPDOWN_MENU_STYLES, DEFAULT_DROPDOWN_PANEL_STYLES } from './MenuStyleCommon'

const CatalogMenu = ({ currentOpenMenu, onToggleDropdown }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <>
      <MenuHeader
        id={CATALOG_MENU}
        titleKey={'header.catalog'}
        onToggleDropdown={onToggleDropdown}
        currentOpenMenu={currentOpenMenu}
      />
      {currentOpenMenu === CATALOG_MENU &&
        <div className={DEFAULT_DROPDOWN_PANEL_STYLES} role='menu'>
          <div className='rounded-t-md bg-dial-slate-300'>
            <div className='text-dial-stratos font-semibold px-4 py-3'>
              {format('header.catalog')}
            </div>
          </div>
          {Object.entries(TOOL_NAVIGATION_ITEMS).map(([key, value]) => {
            return (
              <Link
                key={`tool-menu-${key}`}
                href={`/${value}`}
                role='menuitem'
                className={DEFAULT_DROPDOWN_MENU_STYLES}
              >
                {format(key)}
              </Link>
            )
          })}
          <div className='bg-dial-slate-300 text-dial-stratos font-semibold px-4 py-3'>
            {format('header.supportingTools')}
          </div>
          {Object.entries(SUPPORTING_NAVIGATION_ITEMS).map(([key, value]) => {
            return (
              <Link
                key={`supporting-menu-${key}`}
                href={`/${value}`}
                role='menuitem'
                className={DEFAULT_DROPDOWN_MENU_STYLES}
              >
                {format(key)}
              </Link>
            )
          })}
        </div>
      }
    </>
  )
}

export default CatalogMenu
