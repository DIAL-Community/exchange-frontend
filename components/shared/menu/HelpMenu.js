import { useRouter } from 'next/router'
import { useCallback, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import ReportIssue from '../ReportIssue'
import { HELP_MENU, MenuHeader, NONE } from './MenuCommon'
import { DEFAULT_DROPDOWN_MENU_STYLES, DEFAULT_DROPDOWN_PANEL_STYLES } from './MenuStyleCommon'

const HelpMenu = ({ currentOpenMenu, onToggleDropdown }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()
  const { locale } = router

  const [showForm, setShowForm] = useState(false)

  const helpPopoverButton = useRef(null)
  const helpPopover = useRef(null)

  const showFeedbackForm = (e) => {
    e.preventDefault()
    setShowForm(true)
  }

  const hideFeedbackForm = () => {
    setShowForm(false)
    onToggleDropdown(NONE)
  }

  return (
    <>
      <MenuHeader
        id={HELP_MENU}
        ref={helpPopoverButton}
        title='header.help'
        onToggleDropdown={onToggleDropdown}
        currentOpenMenu={currentOpenMenu}
      />
      {
        currentOpenMenu === HELP_MENU &&
          <div className={DEFAULT_DROPDOWN_PANEL_STYLES} ref={helpPopover} role='menu'>
            <a
              className={DEFAULT_DROPDOWN_MENU_STYLES}
              href={`https://docs.dial.community/projects/product-registry/${locale}/latest/`}
              target='_blank'
              rel='noreferrer'
              role='menuitem'
            >
              {format('header.documentation')}
            </a>
            <a
              href='reportIssue'
              className={DEFAULT_DROPDOWN_MENU_STYLES}
              onClick={(e) => showFeedbackForm(e)}
            >
              {format('app.reportIssue')}
            </a>
          </div>
      }
      {showForm && <ReportIssue showForm={showForm} hideFeedbackForm={hideFeedbackForm} />}
    </>
  )
}

export default HelpMenu
