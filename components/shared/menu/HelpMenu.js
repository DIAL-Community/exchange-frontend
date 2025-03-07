import { useCallback, useState } from 'react'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { OVERVIEW_INTRO_KEY } from '../../../lib/intro'
import ReportIssue from '../ReportIssue'
import { HELP_MENU, MenuHeader, NONE } from './MenuCommon'
import { DEFAULT_DROPDOWN_MENU_STYLES, DEFAULT_DROPDOWN_PANEL_STYLES } from './MenuStyleCommon'

const HelpMenu = ({ currentOpenMenu, onToggleDropdown }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()
  const { locale } = router

  const [showForm, setShowForm] = useState(false)

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
    Cookies.set(OVERVIEW_INTRO_KEY, false)
    window.location.href = '/'
  }

  return (
    <>
      <MenuHeader
        id={HELP_MENU}
        titleKey='header.help'
        onToggleDropdown={onToggleDropdown}
        currentOpenMenu={currentOpenMenu}
      />
      {currentOpenMenu === HELP_MENU &&
        <div className={DEFAULT_DROPDOWN_PANEL_STYLES} role='menu'>
          <Link href='/about' role='menuitem' className={DEFAULT_DROPDOWN_MENU_STYLES}>
            {format('header.about')}
          </Link>
          <a
            href='startOverviewTour'
            className={DEFAULT_DROPDOWN_MENU_STYLES}
            onClick={(e) => startOverviewTour(e)}
          >
            {format('intro.overview.startTour')}
          </a>
          <a
            className={DEFAULT_DROPDOWN_MENU_STYLES}
            href={
              '//digital-impact-exchange.atlassian.net/wiki/spaces/SOLUTIONS' +
              '/pages/541917207/Community+Code+of+Conduct/'
            }
            target='_blank'
            rel='noreferrer'
            role='menuitem'
          >
            {format('header.coc')}
          </a>
          <a
            className={DEFAULT_DROPDOWN_MENU_STYLES}
            href={`//docs.dial.community/projects/product-registry/${locale}/latest/`}
            target='_blank'
            rel='noreferrer'
            role='menuitem'
          >
            {format('header.documentation')}
          </a>
          <div className='mx-4 border-b border-dial-slate-300' />
          <a
            className={DEFAULT_DROPDOWN_MENU_STYLES}
            href='//solutions-catalog.atlassian.net/wiki/spaces/SOLUTIONS/overview'
            target='_blank'
            rel='noreferrer'
            role='menuitem'
          >
            {format('header.confluence')}
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
      {showForm &&
        <ReportIssue
          showForm={showForm}
          hideFeedbackForm={hideFeedbackForm}
          formTitle={format('app.reportIssue')}
        />
      }
    </>
  )
}

export default HelpMenu
