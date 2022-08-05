import Link from 'next/link'
import { useRouter } from 'next/router'
import { signIn, signOut, useSession } from 'next-auth/client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useIntl } from 'react-intl'
import { HiChevronDown, HiChevronUp } from 'react-icons/hi'
import MobileMenu from './MobileMenu'
import ReportIssue from './shared/ReportIssue'

const RESOURCE_MENU = 'resourceMenu'
const ABOUT_MENU = 'aboutMenu'
const HELP_MENU = 'helpMenu'
const LANGUAGE_MENU = 'switchLanguage'
const ADMIN_MENU = 'adminMenu'
const USER_MENU ='userMenu'
const NONE = ''

const menuItemStyles = `
    lg:p-3 px-0 block border-b-2 border-transparent hover:border-dial-yellow
  `

const dropdownMenuStyles = `
    block px-4 py-2 text-base text-gray-700 hover:bg-gray-100 hover:text-gray-900
  `

const dropdownPanelStyles = `
    origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white
    ring-1 ring-black ring-opacity-5 focus:outline-none z-30
  `

const AdminMenu = ({ isCurrentOpenMenu, onToggle }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })
  const [session] = useSession()

  const buttonRef = useRef()
  const popoverRef = useRef()

  const toggleSwitcher = (e) => {
    e.preventDefault()
    onToggle(!isCurrentOpenMenu, ADMIN_MENU)
  }

  const { userEmail, userToken } = session.user

  return (
    <>
      <a
        id={ADMIN_MENU}
        data-testid='admin-menu'
        className={`${menuItemStyles} lg:mb-0 mb-2 inline`} ref={buttonRef}
        href='admin' onClick={(e) => toggleSwitcher(e)}
      >
        <div id={ADMIN_MENU} className={`${menuItemStyles} inline`}>{format('header.admin')} 
          {
            isCurrentOpenMenu ? <HiChevronUp className='ml-1 inline text-2xl' /> : <HiChevronDown className='ml-1 inline text-2xl' />
          }
        </div>
      </a>
      <div className={`${isCurrentOpenMenu ? 'block' : 'hidden'} ${dropdownPanelStyles}`} ref={popoverRef} role='menu'>
        <div className='py-1' role='none'>
          <Link href='/users'>
            <a href='/users' role='menuitem' className={dropdownMenuStyles}>
              {format('header.admin.users')}
            </a>
          </Link>
          <a href={`${process.env.NEXT_PUBLIC_RAILS_SERVER}/settings?user_email=${userEmail}&user_token=${userToken}`} role='menuitem' className={dropdownMenuStyles}>
            {format('header.admin.settings')}
          </a>
          <Link href='/sectors' >
            <a role='menuitem' className={dropdownMenuStyles}>
              {format('header.admin.sectors')}
            </a>
          </Link>
          <Link href='/countries' >
            <a role='menuitem' className={dropdownMenuStyles}>
              {format('header.admin.countries')}
            </a>
          </Link>
          <Link href='/tags'>
            <a role='menuitem' className={dropdownMenuStyles}>
              {format('header.admin.tags')}
            </a>
          </Link>
          <a href='/candidate/organizations' role='menuitem' className={dropdownMenuStyles}>
            {format('header.admin.candidate_orgs')}
          </a>
          <a href='/candidate/products' role='menuitem' className={dropdownMenuStyles}>
            {format('header.admin.candidate_products')}
          </a>
          <a href='/candidate/roles' role='menuitem' className={dropdownMenuStyles}>
            {format('header.admin.candidate_roles')}
          </a>
          <a href={`${process.env.NEXT_PUBLIC_RAILS_SERVER}/deploys?user_email=${userEmail}&user_token=${userToken}`} role='menuitem' className={dropdownMenuStyles}>
            {format('header.admin.deploys')}
          </a>
          <a href={`${process.env.NEXT_PUBLIC_RAILS_SERVER}/portal_views?user_email=${userEmail}&user_token=${userToken}`} role='menuitem' className={dropdownMenuStyles}>
            {format('header.admin.portal_views')}
          </a>
          <a href={`${process.env.NEXT_PUBLIC_RAILS_SERVER}/maturity_rubrics?user_email=${userEmail}&user_token=${userToken}`} role='menuitem' className={dropdownMenuStyles}>
            {format('header.admin.maturity_rubrics')}
          </a>
        </div>
      </div>
    </>
  )
}

const UserMenu = ({ isCurrentOpenMenu, onToggle }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const [session] = useSession()

  const userName = session.user && session.user.name && session.user.name.toUpperCase()

  const buttonRef = useRef()
  const popoverRef = useRef()

  const signOutUser = (e) => {
    e.preventDefault()
    signOut()
  }

  const toggleSwitcher = (e) => {
    e.preventDefault()
    onToggle(!isCurrentOpenMenu, USER_MENU)
  }

  return (
    <>
      <a
        id={USER_MENU}
        data-testid='user-menu'
        className={`${menuItemStyles} lg:mb-0 mb-2 inline bg-dial-yellow-light pt-2 pb-2 rounded`} ref={buttonRef}
        href='signOut' onClick={(e) => toggleSwitcher(e)}
      >
        <img src='/icons/user.svg' className='inline mx-2' alt='Back' height='20px' width='20px' />
        <div id={USER_MENU} className='inline text-xs'>{userName}
          {
            isCurrentOpenMenu ? <HiChevronUp className='ml-1 inline text-2xl' /> : <HiChevronDown className='ml-1 inline text-2xl' />
          }
        </div>
      </a>
      <div className={`${isCurrentOpenMenu ? 'block' : 'hidden'} ${dropdownPanelStyles}`} ref={popoverRef} role='menu'>
        <div className='py-1' role='none'>
          <Link href='/auth/profile'>
            <a href='/auth/profile' role='menuitem' className={dropdownMenuStyles}>
              {format('header.profile')}
            </a>
          </Link>
          <a href='en' role='menuitem' className={dropdownMenuStyles} onClick={signOutUser}>
            {format('header.signOut')}
          </a>
        </div>
      </div>
    </>
  )
}

const Header = () => {
  const [session] = useSession()
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const signInUser = (e) => {
    e.preventDefault()
    process.env.NEXT_PUBLIC_AUTH_TYPE === 'auth0' ? signIn('Auth0', { callbackUrl: process.env.NEXT_PUBLIC_API_URL }) : signIn()
  }

  const [menuExpanded, setMenuExpanded] = useState(false)

  const [currentOpenMenu, setCurrentOpenMenu] = useState(NONE)

  const [showForm, setShowForm] = useState(false)

  const { pathname, asPath, query } = useRouter()
  const router = useRouter()
  const { locale } = useRouter()

  const languagePopoverButton = useRef(null)
  const languagePopover = useRef(null)

  const resourcePopoverButton = useRef(null)
  const resourcePopover = useRef(null)

  const aboutPopoverButton = useRef(null)
  const aboutPopover = useRef(null)
  
  const helpPopoverButton = useRef(null)
  const helpPopover = useRef(null)
  
  const isAdmin = session?.user?.roles?.includes('admin')

  const handleClickOutside = useCallback((event) => {

    const clickedMenu = event.target.getAttribute('id')
    if (clickedMenu === RESOURCE_MENU && currentOpenMenu !== RESOURCE_MENU) {
      setCurrentOpenMenu(RESOURCE_MENU)
    } else if (clickedMenu === ABOUT_MENU && currentOpenMenu !== ABOUT_MENU) {
      setCurrentOpenMenu(ABOUT_MENU)
    } else if (clickedMenu === HELP_MENU && currentOpenMenu !== HELP_MENU) {
      setCurrentOpenMenu(HELP_MENU)
    } else if (clickedMenu === LANGUAGE_MENU && currentOpenMenu !== LANGUAGE_MENU) {
      setCurrentOpenMenu(LANGUAGE_MENU)
    } else if (clickedMenu === ADMIN_MENU && currentOpenMenu !== ADMIN_MENU) {
      setCurrentOpenMenu(ADMIN_MENU)
    } else if (clickedMenu === USER_MENU && currentOpenMenu !== USER_MENU) {
      setCurrentOpenMenu(USER_MENU)
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

  const showFeedbackForm = () => {
    setShowForm(true)
  }
  
  const switchLanguage = (e, localeCode) => {
    e.preventDefault()
    router.push({ pathname, query }, asPath, { locale: localeCode })
    setCurrentOpenMenu(NONE)
  }

  const toggleLanguageSwitcher = (e) => {
    e.preventDefault()
    setCurrentOpenMenu(currentOpenMenu === LANGUAGE_MENU ? NONE : LANGUAGE_MENU)
  }

  const toggleResourceSwitcher = (e) => {
    e.preventDefault()
    setCurrentOpenMenu(currentOpenMenu === RESOURCE_MENU ? NONE : RESOURCE_MENU)
  }

  const toggleAboutSwitcher = (e) => {
    e.preventDefault()
    setCurrentOpenMenu(currentOpenMenu === ABOUT_MENU ? NONE : ABOUT_MENU)
  }

  const toggleHelpSwitcher = (e) => {
    e.preventDefault()
    setCurrentOpenMenu(currentOpenMenu === HELP_MENU ? NONE : HELP_MENU)
  }

  const toggleMenu = () => {
    setMenuExpanded(!menuExpanded)
  }

  const toggleAdminOrUserMenu = (isOpen, openedMenuId) => {
    if (isOpen && openedMenuId === USER_MENU) {
      setCurrentOpenMenu(USER_MENU)
    } else if (isOpen && openedMenuId === ADMIN_MENU) {
      setCurrentOpenMenu(ADMIN_MENU)
    } else {
      setCurrentOpenMenu(NONE)
    }
  }

  return (
    <header className='z-70 sticky top-0 border-b-2 border-dial-gray-dark bg-white'>
      <div className='flex flex-wrap justify-center items-center py-3 lg:py-0 max-w-catalog header-min-height mx-auto'>
        <div className='flex-1 flex my-auto'>
          <Link href='/'>
            <a href='/' className='px-6 lg:px-8'>
              <div className='text-dial-blue-darkest text-xs'>
                {format('landing.subtitle')}
              </div>
              <div className='font-bold text-base text-dial-blue-darkest'>
                <span className='block'>
                  {format('landing.title.firstLine')} {format('landing.title.secondLine')}
                </span>
              </div>
            </a>
          </Link>
        </div>

        <label htmlFor='menu-toggle' className='pointer-cursor block lg:hidden px-8'>
          <svg className='fill-current text-gray-900' xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'>
            <title>Menu</title>
            <path d='M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z' />
          </svg>
        </label>
        <input className='hidden' type='checkbox' id='menu-toggle' checked={menuExpanded} onChange={toggleMenu} />

        <div className='hidden lg:flex lg:items-center lg:w-auto w-full' id='menu'>
          <nav>
            <MobileMenu menuExpanded={menuExpanded} setMenuExpanded={setMenuExpanded} />
            <ul className='hidden lg:flex items-center justify-between text-base text-dial-blue-darkest pt-4 lg:pt-0'>
              <li className='relative mt-2 lg:mt-0 text-right sm:mx-6 lg:mx-0'>
                <a
                  id={RESOURCE_MENU}
                  className={`${menuItemStyles} lg:mb-0 mb-2 inline`} ref={resourcePopoverButton}
                  href='resourceMenu' onClick={(e) => toggleResourceSwitcher(e)}
                >
                  {format('header.resources')}
                  {
                    currentOpenMenu === RESOURCE_MENU ? <HiChevronUp className='ml-1 inline text-2xl' /> : <HiChevronDown className='ml-1 inline text-2xl' />
                  }
                </a>
                <div className={`${currentOpenMenu === RESOURCE_MENU ? 'block' : 'hidden'} ${dropdownPanelStyles}`} ref={resourcePopover} role='menu'>
                  <div className='py-1' role='none'>
                    <Link href='/covid-19-resources'>
                      <a href='/covid-19-resources' role='menuitem' className={dropdownMenuStyles}>
                        {format('header.covidResources')}
                      </a>
                    </Link>
                    <a
                      href='//resources.dial.community/' target='_blank' rel='noreferrer'
                      role='menuitem' className={dropdownMenuStyles} 
                    >
                      {format('header.dialResourcesPortal')}
                    </a>
                    <a
                      href='//digitalimpactalliance.org/research/sdg-digital-investment-framework/' target='_blank' rel='noreferrer'
                      role='menuitem' className={dropdownMenuStyles} 
                    >
                      {format('header.SDGFramework')}
                    </a>
                  </div>
                </div>
              </li>
              <li className='relative mt-2 lg:mt-0 text-right sm:mx-6 lg:mx-0'>
                <a
                  id={ABOUT_MENU}
                  className={`${menuItemStyles} lg:mb-0 mb-2 inline`} ref={aboutPopoverButton}
                  href='aboutMenu' onClick={(e) => toggleAboutSwitcher(e)}
                >
                  {format('header.about')}
                  {
                    currentOpenMenu === ABOUT_MENU ? <HiChevronUp className='ml-1 inline text-2xl' /> : <HiChevronDown className='ml-1 inline text-2xl' />
                  }
                </a>
                <div className={`${currentOpenMenu === ABOUT_MENU ? 'block' : 'hidden'} ${dropdownPanelStyles}`} ref={aboutPopover} role='menu'>
                  <div className='py-1' role='none'>
                    <Link href='/about'>
                      <a href='/about' role='menuitem' className={dropdownMenuStyles}>
                        {format('header.about')}
                      </a>
                    </Link>
                    <a
                      href='//solutions-catalog.atlassian.net/wiki/spaces/SOLUTIONS/overview' target='_blank' rel='noreferrer'
                      role='menuitem' className={dropdownMenuStyles} 
                    >
                      {format('header.confluence')}
                    </a>
                  </div>
                </div>
              </li>
              {
                session
                  ? (
                    <>
                      <li className='relative mt-2 lg:mt-0 text-right sm:mx-6 lg:mx-0'>
                        {isAdmin && (<AdminMenu isCurrentOpenMenu={currentOpenMenu === ADMIN_MENU} onToggle={toggleAdminOrUserMenu}  />)}
                      </li>
                      <li className='relative mt-2 lg:mt-0 text-right sm:mx-6 lg:mx-0'>
                        <UserMenu isCurrentOpenMenu={currentOpenMenu === USER_MENU} onToggle={toggleAdminOrUserMenu}/>
                      </li>
                    </>
                  )
                  : (
                    <li className='relative mt-2 lg:mt-0 text-right sm:mx-6 lg:mx-0'>
                      <a data-testid='login' href='signin' role='menuitem' className={dropdownMenuStyles} onClick={signInUser}>
                        {format('header.signIn')}
                      </a>
                    </li>
                  )
              }
              <li className='relative mt-2 lg:mt-0 text-right sm:mx-6 lg:mx-0'>
                <a
                  id={HELP_MENU}
                  className={`${menuItemStyles} lg:mb-0 mb-2 inline`} ref={helpPopoverButton}
                  href='helpMenu' onClick={(e) => toggleHelpSwitcher(e)}
                >
                  {format('header.help')}
                  {
                    currentOpenMenu === HELP_MENU ? <HiChevronUp className='ml-1 inline text-2xl' /> : <HiChevronDown className='ml-1 inline text-2xl' />
                  }
                </a>
                <div className={`${currentOpenMenu === HELP_MENU ? 'block' : 'hidden'} ${dropdownPanelStyles}`} ref={helpPopover} role='menu'>
                  <a
                    className={dropdownMenuStyles}
                    href={`https://docs.osc.dial.community/projects/product-registry/${locale}/latest/`}
                    target='_blank' rel='noreferrer'
                  >
                    {format('header.documentation')}
                  </a>
                  <a href='#' className={dropdownMenuStyles} onClick={showFeedbackForm}>
                    {format('app.reportIssue')}
                    {showForm && <ReportIssue showForm={showForm} setShowForm={setShowForm} />}
                  </a>
                </div>
              </li>
              <li><div className='border border-gray-400 border-t-0 lg:border-l-0 lg:h-9' /></li>
              <li className='relative mt-2 lg:mt-0 text-right sm:mx-6 lg:mx-0'>
                <a
                  id={LANGUAGE_MENU}
                  className={`${menuItemStyles} lg:mb-0 mb-2 inline`} ref={languagePopoverButton}
                  href='switchLanguage' onClick={(e) => toggleLanguageSwitcher(e)}
                >
                  {format('header.selectLanguage')}
                  {
                    currentOpenMenu === LANGUAGE_MENU ? <HiChevronUp className='ml-1 inline text-2xl' /> : <HiChevronDown className='ml-1 inline text-2xl' />
                  }
                </a>
                <div className={`${currentOpenMenu === LANGUAGE_MENU ? 'block' : 'hidden'} ${dropdownPanelStyles}`} ref={languagePopover} role='menu'>
                  <div className='py-1' role='none'>
                    <a href='en' role='menuitem' className={dropdownMenuStyles} onClick={(e) => switchLanguage(e, 'en')}>
                      {format('header.english')}
                    </a>
                    <a href='de' role='menuitem' className={dropdownMenuStyles} onClick={(e) => switchLanguage(e, 'de')}>
                      {format('header.german')}
                    </a>
                    <a href='es' role='menuitem' className={dropdownMenuStyles} onClick={(e) => switchLanguage(e, 'es')}>
                      {format('header.spanish')}
                    </a>
                    <a href='fr' role='menuitem' className={dropdownMenuStyles} onClick={(e) => switchLanguage(e, 'fr')}>
                      {format('header.french')}
                    </a>
                    <a href='pt' role='menuitem' className={dropdownMenuStyles} onClick={(e) => switchLanguage(e, 'pt')}>
                      {format('header.portuguese')}
                    </a>
                    <a href='sw' role='menuitem' className={dropdownMenuStyles} onClick={(e) => switchLanguage(e, 'sw')}>
                      {format('header.swahili')}
                    </a>
                    <a href='cs' role='menuitem' className={dropdownMenuStyles} onClick={(e) => switchLanguage(e, 'cs')}>
                      {format('header.czech')}
                    </a>
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

export default Header
