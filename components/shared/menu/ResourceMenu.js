import Link from 'next/link'
import { useCallback, useRef } from 'react'
import { useIntl } from 'react-intl'
import { MenuHeader, RESOURCE_MENU } from './MenuCommon'
import { DEFAULT_DROPDOWN_MENU_STYLES, DEFAULT_DROPDOWN_PANEL_STYLES } from './MenuStyleCommon'

const ResourceMenu = ({ currentOpenMenu, onToggleDropdown }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const resourcePopoverButton = useRef(null)
  const resourcePopover = useRef(null)

  return (
    <>
      <MenuHeader
        id={RESOURCE_MENU}
        ref={resourcePopoverButton}
        title='header.resources'
        onToggleDropdown={onToggleDropdown}
        currentOpenMenu={currentOpenMenu}
      />
      {
        currentOpenMenu === RESOURCE_MENU &&
          <div className={DEFAULT_DROPDOWN_PANEL_STYLES} ref={resourcePopover} role='menu'>
            <Link href='/covid-19-resources' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
              {format('header.covidResources')}
            </Link>
            <a
              href='//resources.dial.community/'
              className={DEFAULT_DROPDOWN_MENU_STYLES}
              target='_blank'
              rel='noreferrer'
              role='menuitem'
            >
              {format('header.dialResourcesPortal')}
            </a>
            <a
              href='//digitalimpactalliance.org/research/sdg-digital-investment-framework/'
              className={DEFAULT_DROPDOWN_MENU_STYLES}
              target='_blank'
              rel='noreferrer'
              role='menuitem'
            >
              {format('header.SDGFramework')}
            </a>
            <Link href='/resources' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
              {format('header.blogs')}
            </Link>
          </div>
      }
    </>
  )
}

export default ResourceMenu
