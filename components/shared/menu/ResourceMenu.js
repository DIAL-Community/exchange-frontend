import { useCallback } from 'react'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { MenuHeader, RESOURCE_MENU } from './MenuCommon'
import { DEFAULT_DROPDOWN_MENU_STYLES, DEFAULT_DROPDOWN_PANEL_STYLES } from './MenuStyleCommon'

const ResourceMenu = ({ currentOpenMenu, onToggleDropdown, title }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <>
      <MenuHeader
        id={RESOURCE_MENU}
        title={title ? title : 'header.resources'}
        onToggleDropdown={onToggleDropdown}
        currentOpenMenu={currentOpenMenu}
      />
      {currentOpenMenu === RESOURCE_MENU &&
        <div className={DEFAULT_DROPDOWN_PANEL_STYLES} role='menu'>
          <Link href='/playbooks' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
            {format('header.playbooks')}
          </Link>
          <Link href='/wizard' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
            {format('header.wizard')}
          </Link>
          <Link href='/resources' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
            {format('header.insights')}
          </Link>
          <Link href='/govstack' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
            {format('header.govstack')}
          </Link>
        </div>
      }
    </>
  )
}

export default ResourceMenu
