import { useCallback } from 'react'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { ADMIN_MENU, MenuHeader } from './MenuCommon'
import { DEFAULT_DROPDOWN_MENU_STYLES, DEFAULT_DROPDOWN_PANEL_STYLES } from './MenuStyleCommon'

const AdminMenu = ({ currentOpenMenu, onToggleDropdown }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <>
      <MenuHeader
        id={ADMIN_MENU}
        title='header.admin'
        onToggleDropdown={onToggleDropdown}
        currentOpenMenu={currentOpenMenu}
      />
      {currentOpenMenu === ADMIN_MENU &&
        <div className={DEFAULT_DROPDOWN_PANEL_STYLES} role='menu'>
          <Link href='/health/candidate/roles' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
            {format('ui.candidateRole.header')}
          </Link>
        </div>
      }
    </>
  )
}

export default AdminMenu
