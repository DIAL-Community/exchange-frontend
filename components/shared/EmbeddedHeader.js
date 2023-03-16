import { useRouter } from 'next/router'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useIntl } from 'react-intl'
import { HiChevronDown, HiChevronUp } from 'react-icons/hi'
import MobileMenu from '../MobileMenu'

const LANGUAGE_MENU = 'switchLanguage'
const NONE = ''

const menuItemStyles = `
    lg:p-3 px-0 block border-b-2 border-transparent hover:border-dial-sunshine
  `

const dropdownMenuStyles = `
    block px-4 py-2 text-base text-white-beech hover:bg-gray-100 hover:text-gray-900
  `

const dropdownPanelStyles = `
    origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white
    ring-1 ring-black ring-opacity-5 focus:outline-none z-30
  `

const AVAILABLE_LANGUAGES = {
  'en': 'header.english',
  'de': 'header.german',
  'es': 'header.spanish',
  'fr': 'header.french',
  'pt': 'header.portuguese',
  'sw': 'header.swahili',
  'cs': 'header.czech'
}

const EmbeddedHeader = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const [menuExpanded, setMenuExpanded] = useState(false)

  const [currentOpenMenu, setCurrentOpenMenu] = useState(NONE)

  const { pathname, asPath, query } = useRouter()
  const router = useRouter()

  const languagePopoverButton = useRef(null)
  const languagePopover = useRef(null)

  const handleClickOutside = useCallback((event) => {
    const clickedMenu = event.target.getAttribute('id')
    if (clickedMenu === LANGUAGE_MENU && currentOpenMenu !== LANGUAGE_MENU) {
      setCurrentOpenMenu(LANGUAGE_MENU)
    } else {
      setCurrentOpenMenu(NONE)
    }
  }, [currentOpenMenu])

  useEffect(() => {
    // call addEventListener() only when menu dropdown is open
    if (currentOpenMenu !== NONE) {
      // whenever user clicks somewhere on the page - fire handleClickOutside
      // so that the current menu is closed and, if clicked, another menu is opened
      // e.g. About menu -> Help menu
      document.addEventListener('click', handleClickOutside)

      // whenever currentOpenMenu changes - remove the listener
      return () => {
        document.removeEventListener('click', handleClickOutside)
      }
    }
  }, [handleClickOutside, currentOpenMenu])

  const switchLanguage = (e, localeCode) => {
    e.preventDefault()
    router.push({ pathname, query }, asPath, { locale: localeCode })
    setCurrentOpenMenu(NONE)
  }

  const toggleLanguageSwitcher = (e) => {
    e.preventDefault()
    setCurrentOpenMenu(currentOpenMenu === LANGUAGE_MENU ? NONE : LANGUAGE_MENU)
  }

  const toggleMenu = () => {
    setMenuExpanded(!menuExpanded)
  }

  return (
    <header className='z-70 sticky top-0 border-b-2 border-dial-gray-dark bg-white'>
      <div className='flex flex-wrap justify-center items-center py-3 lg:py-0 header-min-height'>
        <div className='flex-1 flex my-auto'>
          <a href='' className='text-center mx-auto'>
            <div className='text-dial-blue-darkest text-xs'>
              Powered By
            </div>
            <div className='font-bold text-dial-sapphire-darkest'>
              <span className='block'>
                <a href='https://solutions.dial.community' target='_blank' rel='noreferrer'>
                  {format('app.title')}
                </a>
              </span>
            </div>
          </a>
        </div>

        <label htmlFor='menu-toggle' className='pointer-cursor block lg:hidden px-8'>
          <svg
            className='fill-current text-gray-900' xmlns='http://www.w3.org/2000/svg'
            width='20' height='20' viewBox='0 0 20 20'
          >
            <title>Menu</title>
            <path d='M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z' />
          </svg>
        </label>
        <input className='hidden' type='checkbox' id='menu-toggle' checked={menuExpanded} onChange={toggleMenu} />

        <div className='hidden lg:flex lg:items-center lg:w-auto w-full' id='menu'>
          <nav>
            <MobileMenu menuExpanded={menuExpanded} setMenuExpanded={setMenuExpanded} />
            <ul className='hidden lg:flex items-center justify-between text-base text-dial-blue-darkest pt-4 lg:pt-0'>
              <li><div className='border border-gray-400 border-t-0 lg:border-l-0 lg:h-9' /></li>
              <li className='relative mt-2 lg:mt-0 text-right sm:mx-6 lg:mx-0'>
                <a
                  id={LANGUAGE_MENU}
                  className={`${menuItemStyles} lg:mb-0 mb-2 inline`} ref={languagePopoverButton}
                  href='switchLanguage' onClick={(e) => toggleLanguageSwitcher(e)}
                >
                  {format('header.selectLanguage')}
                  {
                    currentOpenMenu === LANGUAGE_MENU
                      ? <HiChevronUp className='ml-1 inline text-2xl' />
                      : <HiChevronDown className='ml-1 inline text-2xl' />
                  }
                </a>
                <div
                  className={`${currentOpenMenu === LANGUAGE_MENU ? 'block' : 'hidden'} ${dropdownPanelStyles}`}
                  ref={languagePopover} role='menu'
                >
                  <div className='py-1' role='none'>
                    {Object.keys(AVAILABLE_LANGUAGES).map((languageKey, index) => {
                      return (
                        <a
                          key={index} href='en' role='menuitem'
                          className={dropdownMenuStyles}
                          onClick={(e) => switchLanguage(e, languageKey)}
                        >
                          {format(AVAILABLE_LANGUAGES[languageKey])}
                        </a>
                      )
                    })}
                  </div>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default EmbeddedHeader
