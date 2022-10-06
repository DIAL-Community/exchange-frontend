import Link from 'next/link'
import { useCallback, useRef } from 'react'
import { useIntl } from 'react-intl'
import { ABOUT_MENU, MenuHeader } from './MenuCommon'
import { DEFAULT_DROPDOWN_MENU_STYLES, DEFAULT_DROPDOWN_PANEL_STYLES } from './MenuStyleCommon'

const AboutMenu = ({ currentOpenMenu, onToggleDropdown }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const aboutPopoverButton = useRef(null)
  const aboutPopover = useRef(null)

  return (
    <>
      <MenuHeader
        id={ABOUT_MENU}
        ref={aboutPopoverButton}
        title='header.about'
        onToggleDropdown={onToggleDropdown}
        currentOpenMenu={currentOpenMenu}
      />
      {
        currentOpenMenu === ABOUT_MENU &&
          <div className={DEFAULT_DROPDOWN_PANEL_STYLES} ref={aboutPopover} role='menu'>
            <Link href='/about'>
              <a role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
                {format('header.about')}
              </a>
            </Link>
            <a
              className={DEFAULT_DROPDOWN_MENU_STYLES}
              href='//solutions-catalog.atlassian.net/wiki/spaces/SOLUTIONS/overview'
              target='_blank'
              rel='noreferrer'
              role='menuitem'
            >
              {format('header.confluence')}
            </a>
          </div>
      }
    </>
  )
}

export default AboutMenu
