import { useCallback } from 'react'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { MARKETPLACE_MENU, MenuHeader } from './MenuCommon'
import { DEFAULT_DROPDOWN_MENU_STYLES, DEFAULT_DROPDOWN_PANEL_STYLES } from './MenuStyleCommon'

const MarketplaceMenu = ({ currentOpenMenu, onToggleDropdown, title }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <>
      <MenuHeader
        id={MARKETPLACE_MENU}
        titleKey={title ? title : 'ui.marketplace.label'}
        onToggleDropdown={onToggleDropdown}
        currentOpenMenu={currentOpenMenu}
      />
      {currentOpenMenu === MARKETPLACE_MENU &&
        <div className={DEFAULT_DROPDOWN_PANEL_STYLES} role='menu'>
          <Link href='/opportunities' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
            {format('ui.opportunity.header')}
          </Link>
          <Link href='/storefronts' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
            {format('ui.storefront.header')}
          </Link>
        </div>
      }
    </>
  )
}

export default MarketplaceMenu
