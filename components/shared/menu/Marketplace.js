import Link from 'next/link'
import { useCallback, useRef } from 'react'
import { useIntl } from 'react-intl'
import { MARKETPLACE_MENU, MenuHeader } from './MenuCommon'
import { DEFAULT_DROPDOWN_MENU_STYLES, DEFAULT_DROPDOWN_PANEL_STYLES } from './MenuStyleCommon'

const MarketplaceMenu = ({ currentOpenMenu, onToggleDropdown }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const marketplacePopoverButton = useRef(null)
  const marketplacePopover = useRef(null)

  return (
    <>
      <MenuHeader
        id={MARKETPLACE_MENU}
        ref={marketplacePopoverButton}
        title='header.marketplace'
        onToggleDropdown={onToggleDropdown}
        currentOpenMenu={currentOpenMenu}
      />
      {currentOpenMenu === MARKETPLACE_MENU &&
        <div className={DEFAULT_DROPDOWN_PANEL_STYLES} ref={marketplacePopover} role='menu'>
          <Link href='/opportunities' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
            {format('opportunity.header')}
          </Link>
          <Link href='/storefronts' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
            {format('storefront.header')}
          </Link>
        </div>
      }
    </>
  )
}

export default MarketplaceMenu
