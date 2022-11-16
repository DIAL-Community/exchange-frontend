import { useRouter } from 'next/router'
import { useCallback, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import cookie from 'react-cookies'
import ReportIssue from '../ReportIssue'
import { OVERVIEW_INTRO_KEY } from '../../Intro'
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

  const startOverviewTour = (e) => {
    e.preventDefault()
    cookie.save(OVERVIEW_INTRO_KEY, false)
    router.push('/')
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
              href={`https://docs.osc.dial.community/projects/product-registry/${locale}/latest/`}
              target='_blank' rel='noreferrer'
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
            <a
              href='startOverviewTour'
              className={DEFAULT_DROPDOWN_MENU_STYLES}
              onClick={(e) => startOverviewTour(e)}
            >
              {format('intro.overview.startTour')}
            </a>
          </div>
      }
      {showForm && <ReportIssue showForm={showForm} hideFeedbackForm={hideFeedbackForm} />}
    </>
  )
}

export default HelpMenu
