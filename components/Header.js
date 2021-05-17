import Link from 'next/link'
import { useRouter } from 'next/router'
import { signIn, signOut, useSession } from 'next-auth/client'

import { useState, createRef } from 'react'
import { useIntl } from 'react-intl'
import { HiChevronDown, HiChevronUp } from 'react-icons/hi'

import { createPopper } from '@popperjs/core'

const headerStyles = `
    relative w-full z-30 sticky top-0 border-b-2 border-dial-gray-dark bg-white flex flex-wrap
    items-center py-2 lg:py-0
  `

  const menuItemStyles = `
    lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-400
  `

  const dropdwonMenuStyles = `
    block px-4 py-2 text-base text-gray-700 hover:bg-gray-100 hover:text-gray-900
  `

  const dropdownPanelStyles = `
    origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white
    ring-1 ring-black ring-opacity-5 focus:outline-none
  `

const AdminMenu = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const [showAdminMenu, setShowAdminMenu] = useState(false)

  const buttonRef = createRef()
  const popoverRef = createRef()

  const toggleSwitcher = (e) => {
    e.preventDefault()
    showAdminMenu ? closeDropdownPopover() : openDropdownPopover()
  }

  const openDropdownPopover = () => {
    createPopper(buttonRef.current, popoverRef.current, {
      placement: 'bottom'
    })
    setShowAdminMenu(true)
  }
  const closeDropdownPopover = () => {
    setShowAdminMenu(false)
  }
  
  return (
    <>
    <a className={`lg:mb-0 mb-2 inline`} ref={buttonRef}
      href='admin' onClick={(e) => toggleSwitcher(e)}
    >
      <div className={`${menuItemStyles} inline`}>{format('header.admin')}
        {
          showAdminMenu ? <HiChevronUp className='ml-1 inline text-2xl' /> : <HiChevronDown className='ml-1 inline text-2xl' />
        }
      </div>
    </a>
    <div className={`${showAdminMenu ? 'block' : 'hidden'} ${dropdownPanelStyles}`} ref={popoverRef} role='menu'>
      <div className='py-1' role='none'>
        <a href='/admin/users' role='menuitem' className={dropdwonMenuStyles}>
          {format('header.admin.users')}
        </a>
      </div>
    </div>
  </>
  )
}

const UserMenu = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const [session] = useSession()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const buttonRef = createRef()
  const popoverRef = createRef()

  const signOutUser = (e) => {
    e.preventDefault()
    signOut()
  }

  const toggleSwitcher = (e) => {
    e.preventDefault()
    showUserMenu ? closeDropdownPopover() : openDropdownPopover()
  }

  const openDropdownPopover = () => {
    createPopper(buttonRef.current, popoverRef.current, {
      placement: 'bottom'
    })
    setShowUserMenu(true)
  }
  const closeDropdownPopover = () => {
    setShowUserMenu(false)
  }

  return (
    <>
    <a className={`lg:mb-0 mb-2 inline bg-dial-yellow-light pt-2 pr-2 pb-2 rounded`} ref={buttonRef}
      href='signOut' onClick={(e) => toggleSwitcher(e)}
    >
      <img src='/icons/user.svg' className='inline mx-2' alt='Back' height='20px' width='20px' />
      <div className='inline'>{session.user.username}
        {
          showUserMenu ? <HiChevronUp className='ml-1 inline text-2xl' /> : <HiChevronDown className='ml-1 inline text-2xl' />
        }
      </div>
    </a>
    <div className={`${showUserMenu ? 'block' : 'hidden'} ${dropdownPanelStyles}`} ref={popoverRef} role='menu'>
      <div className='py-1' role='none'>
        <a href='en' role='menuitem' className={dropdwonMenuStyles} onClick={(e) => signOutUser(e)}>
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
  const format = (id) => formatMessage({ id })

  const [showLanguages, setShowLanguages] = useState(false)
  const [showResources, setShowResources] = useState(false)

  const { pathname, asPath, query } = useRouter()
  const router = useRouter()

  const languagePopoverButton = createRef()
  const languagePopover = createRef()

  const resourcePopoverButton = createRef()
  const resourcePopover = createRef()

  const openDropdownPopover = (buttonRef, popoverRef, openCallback) => {
    createPopper(buttonRef.current, popoverRef.current, {
      placement: 'bottom'
    })
    openCallback(true)
  }
  const closeDropdownPopover = (closeCallback) => {
    closeCallback(false)
  }

  const headerStyles = `
    z-30 sticky top-0 border-b-2 border-dial-gray-dark bg-white flex flex-wrap
    items-center py-3 lg:py-0
  `

  const menuItemStyles = `
    lg:p-4 lg:py-3 px-6 py-2 block border-b-2 border-transparent lg:hover:border-indigo-400
  `

  const dropdwonMenuStyles = `
    block px-4 py-2 text-base text-gray-700 hover:bg-gray-100 hover:text-gray-900
  `

  const dropdownPanelStyles = `
    origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white
    ring-1 ring-black ring-opacity-5 focus:outline-none
  `

  const switchLanguage = (e, localeCode) => {
    e.preventDefault()
    router.push({ pathname, query }, asPath, { locale: localeCode })
    setShowLanguages(!showLanguages)
  }

  const toggleLanguageSwitcher = (e) => {
    e.preventDefault()
    showLanguages
      ? closeDropdownPopover(setShowLanguages)
      : openDropdownPopover(languagePopoverButton, languagePopover, setShowLanguages)
  }

  const toggleResourceSwitcher = (e) => {
    e.preventDefault()
    showResources
      ? closeDropdownPopover(setShowResources)
      : openDropdownPopover(resourcePopoverButton, resourcePopover, setShowResources)
  }

  const navigateToCovidResource = (e) => {
    e.preventDefault()
    setShowResources(false)
    // TODO: Replace this with the eventual url of the covid resources.
    router.push('/products')
  }

  const signInUser = (e) => {
    e.preventDefault()
    signIn()
  }

  const signOutUser = (e) => {
    e.preventDefault()
    signOut()
  }

  return (
    <header className={`${headerStyles} header-min-height`}>
      <div className='flex-1 flex justify-between items-center'>
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
        <nav>
          <ul className='lg:flex items-center justify-between text-base text-dial-blue-darkest pt-4 lg:pt-0'>
            <li className='relative mt-2 lg:mt-0'>
              <a
                className={`${menuItemStyles} lg:mb-0 mb-2 inline`} ref={resourcePopoverButton}
                href='switchLanguage' onClick={(e) => toggleResourceSwitcher(e)}
              >
                {format('header.resources')}
                {
                  showResources ? <HiChevronUp className='ml-1 inline text-2xl' /> : <HiChevronDown className='ml-1 inline text-2xl' />
                }
              </a>
              <div className={`${showResources ? 'block' : 'hidden'} ${dropdownPanelStyles}`} ref={resourcePopover} role='menu'>
                <div className='py-1' role='none'>
                  <a href='/covid-19-resources' onClick={navigateToCovidResource} role='menuitem' className={dropdwonMenuStyles}>
                    {format('header.covidResources')}
                  </a>
                  <a
                    href='//resources.dial.community/' target='_blank' rel='noreferrer'
                    role='menuitem' className={dropdwonMenuStyles} onClick={() => setShowResources(false)}
                  >
                    {format('header.dialResourcesPortal')}
                  </a>
                </div>
              </div>
            </li>
            <li><a className={`${menuItemStyles}`} href='about'>{format('header.about')}</a></li>
            {
              session ? 
                (<div>
                  {session.user.can_edit && (<AdminMenu />)}
                  <UserMenu />
                </div>)
              : 
                (<li>
                  <a className={`${menuItemStyles}`} href='sign-in' onClick={(e) => signInUser(e)}>{format('header.signIn')}</a>
                </li>)
            }
            <li>
              <Link href='/help'>
                <a className={`${menuItemStyles} lg:mb-0 mb-2`} href='help'>{format('header.help')}</a>
              </Link>
            </li>
            <li><div className='border border-gray-400 border-t-0 lg:border-l-0 lg:h-9' /></li>
            <li className='relative mt-2 lg:mt-0'>
              <a
                className={`${menuItemStyles} lg:mb-0 mb-2 inline`} ref={languagePopoverButton}
                href='switchLanguage' onClick={(e) => toggleLanguageSwitcher(e)}
              >
                {format('header.selectLanguage')}
                {
                  showLanguages ? <HiChevronUp className='ml-1 inline text-2xl' /> : <HiChevronDown className='ml-1 inline text-2xl' />
                }
              </a>
              <div className={`${showLanguages ? 'block' : 'hidden'} ${dropdownPanelStyles}`} ref={languagePopover} role='menu'>
                <div className='py-1' role='none'>
                  <a href='en' role='menuitem' className={dropdwonMenuStyles} onClick={(e) => switchLanguage(e, 'en')}>
                    {format('header.english')}
                  </a>
                  <a href='de' role='menuitem' className={dropdwonMenuStyles} onClick={(e) => switchLanguage(e, 'de')}>
                    {format('header.german')}
                  </a>
                  <a href='fr' role='menuitem' className={dropdwonMenuStyles} onClick={(e) => switchLanguage(e, 'fr')}>
                    {format('header.french')}
                  </a>
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
