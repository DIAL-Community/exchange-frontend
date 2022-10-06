import { useRouter } from 'next/router'
import { useCallback, useRef } from 'react'
import { useIntl } from 'react-intl'
import { LANGUAGE_MENU, MenuHeader, NONE } from './MenuCommon'
import { DEFAULT_DROPDOWN_MENU_STYLES, DEFAULT_DROPDOWN_PANEL_STYLES } from './MenuStyleCommon'

const SUPPORTED_LANGUAGES = {
  en: 'header.english',
  de: 'header.german',
  es: 'header.spanish',
  fr: 'header.french',
  pt: 'header.portuguese',
  sw: 'header.swahili',
  cs: 'header.czech'
}

const LanguageMenu = ({ currentOpenMenu, onToggleDropdown }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()
  const { pathname, asPath, query } = router

  const languagePopoverButton = useRef(null)
  const languagePopover = useRef(null)

  const switchLanguage = (e, localeCode) => {
    e.preventDefault()
    router.push({ pathname, query }, asPath, { locale: localeCode })
    onToggleDropdown(NONE)
  }

  return (
    <>
      <MenuHeader
        id={LANGUAGE_MENU}
        ref={languagePopoverButton}
        title='header.selectLanguage'
        onToggleDropdown={onToggleDropdown}
        currentOpenMenu={currentOpenMenu}
      />
      {
        currentOpenMenu === LANGUAGE_MENU &&
          <div className={DEFAULT_DROPDOWN_PANEL_STYLES} ref={languagePopover} role='menu'>
            {
              Object.keys(SUPPORTED_LANGUAGES).map((supportedLanguage, index) => (
                <a
                  key={index}
                  href={supportedLanguage}
                  role='menuitem'
                  className={DEFAULT_DROPDOWN_MENU_STYLES}
                  onClick={(e) => switchLanguage(e, supportedLanguage)}
                >
                  {format(SUPPORTED_LANGUAGES[supportedLanguage])}
                </a>
              ))
            }
          </div>
      }
    </>
  )
}

export default LanguageMenu
