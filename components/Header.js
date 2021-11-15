import Link from 'next/link'
import { useRouter } from 'next/router'
import { signIn, signOut, useSession } from 'next-auth/client'

import { useState, createRef } from 'react'
import { useIntl } from 'react-intl'
import { HiChevronDown, HiChevronUp } from 'react-icons/hi'

import { createPopper } from '@popperjs/core'

import MobileMenu from './MobileMenu'

const menuItemStyles = `
    lg:p-3 px-0 block border-b-2 border-transparent hover:border-dial-yellow
  `

const dropdwonMenuStyles = `
    block px-4 py-2 text-base text-gray-700 hover:bg-gray-100 hover:text-gray-900
  `

const dropdownPanelStyles = `
    origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white
    ring-1 ring-black ring-opacity-5 focus:outline-none z-30
  `

const AdminMenu = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })
  const [session] = useSession()

  const [showAdminMenu, setShowAdminMenu] = useState(false)

  const buttonRef = createRef()
  const popoverRef = createRef()

  const toggleSwitcher = (e) => {
    e.preventDefault()
    showAdminMenu ? closeDropdownPopover() : openDropdownPopover()
  }

  const openDropdownPopover = () => {
    createPopper(buttonRef.current, popoverRef.current, {
      placement: 'bottom-end'
    })
    setShowAdminMenu(true)
  }
  const closeDropdownPopover = () => {
    setShowAdminMenu(false)
  }

  const { userEmail, userToken } = session.user

  return (
    <>
      <a
        className={`${menuItemStyles} lg:mb-0 mb-2 inline`} ref={buttonRef}
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
          <a href={`${process.env.NEXT_PUBLIC_RAILS_SERVER}/users?user_email=${userEmail}&user_token=${userToken}`} role='menuitem' className={dropdwonMenuStyles}>
            {format('header.admin.users')}
          </a>
          <a href={`${process.env.NEXT_PUBLIC_RAILS_SERVER}/settings?user_email=${userEmail}&user_token=${userToken}`} role='menuitem' className={dropdwonMenuStyles}>
            {format('header.admin.settings')}
          </a>
          <a href={`${process.env.NEXT_PUBLIC_RAILS_SERVER}/sectors?user_email=${userEmail}&user_token=${userToken}`} role='menuitem' className={dropdwonMenuStyles}>
            {format('header.admin.sectors')}
          </a>
          <a href={`${process.env.NEXT_PUBLIC_RAILS_SERVER}/tags?user_email=${userEmail}&user_token=${userToken}`} role='menuitem' className={dropdwonMenuStyles}>
            {format('header.admin.tags')}
          </a>
          <a href='/candidate/organizations' role='menuitem' className={dropdwonMenuStyles}>
            {format('header.admin.candidate_orgs')}
          </a>
          <a href='/candidate/products' role='menuitem' className={dropdwonMenuStyles}>
            {format('header.admin.candidate_products')}
          </a>
          <a href={`${process.env.NEXT_PUBLIC_RAILS_SERVER}/deploys?user_email=${userEmail}&user_token=${userToken}`} role='menuitem' className={dropdwonMenuStyles}>
            {format('header.admin.deploys')}
          </a>
          <a href={`${process.env.NEXT_PUBLIC_RAILS_SERVER}/portal_views?user_email=${userEmail}&user_token=${userToken}`} role='menuitem' className={dropdwonMenuStyles}>
            {format('header.admin.portal_views')}
          </a>
          <a href={`${process.env.NEXT_PUBLIC_RAILS_SERVER}/maturity_rubrics?user_email=${userEmail}&user_token=${userToken}`} role='menuitem' className={dropdwonMenuStyles}>
            {format('header.admin.maturity_rubrics')}
          </a>
        </div>
      </div>
    </>
  )
}

const UserMenu = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

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
      placement: 'bottom-end'
    })
    setShowUserMenu(true)
  }
  const closeDropdownPopover = () => {
    setShowUserMenu(false)
  }

  return (
    <>
      <a
        className={`${menuItemStyles} lg:mb-0 mb-2 inline bg-dial-yellow-light pt-2 pb-2 rounded`} ref={buttonRef}
        href='signOut' onClick={(e) => toggleSwitcher(e)}
      >
        <img src='/icons/user.svg' className='inline mx-2' alt='Back' height='20px' width='20px' />
        <div className='inline text-xs'>{session.user && session.user.userName && session.user.userName.toUpperCase()}
          {
            showUserMenu ? <HiChevronUp className='ml-1 inline text-2xl' /> : <HiChevronDown className='ml-1 inline text-2xl' />
          }
        </div>
      </a>
      <div className={`${showUserMenu ? 'block' : 'hidden'} ${dropdownPanelStyles}`} ref={popoverRef} role='menu'>
        <div className='py-1' role='none'>
          <a href='en' role='menuitem' className={dropdwonMenuStyles} onClick={signOutUser}>
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

  const [menuExpanded, setMenuExpanded] = useState(false)
  const [showLanguages, setShowLanguages] = useState(false)
  const [showResources, setShowResources] = useState(false)
  const [showAbout, setShowAbout] = useState(false)

  const { pathname, asPath, query } = useRouter()
  const router = useRouter()
  const { locale } = useRouter()

  const languagePopoverButton = createRef()
  const languagePopover = createRef()

  const resourcePopoverButton = createRef()
  const resourcePopover = createRef()

  const aboutPopoverButton = createRef()
  const aboutPopover = createRef()

  const openDropdownPopover = (buttonRef, popoverRef, openCallback) => {
    createPopper(buttonRef.current, popoverRef.current, {
      placement: 'bottom-end'
    })
    openCallback(true)
  }
  const closeDropdownPopover = (closeCallback) => {
    closeCallback(false)
  }

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

  const toggleAboutSwitcher = (e) => {
    e.preventDefault()
    showAbout
      ? closeDropdownPopover(setShowAbout)
      : openDropdownPopover(aboutPopoverButton, aboutPopover, setShowAbout)
  }

  const signInUser = (e) => {
    e.preventDefault()
    signIn()
  }

  const toggleMenu = (e) => {
    setMenuExpanded(!menuExpanded)
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
                    <Link href='/covid-19-resources'>
                      <a href='/covid-19-resources' role='menuitem' className={dropdwonMenuStyles}>
                        {format('header.covidResources')}
                      </a>
                    </Link>
                    <a
                      href='//resources.dial.community/' target='_blank' rel='noreferrer'
                      role='menuitem' className={dropdwonMenuStyles} onClick={() => setShowResources(false)}
                    >
                      {format('header.dialResourcesPortal')}
                    </a>
                    <a
                      href='//digitalimpactalliance.org/research/sdg-digital-investment-framework/' target='_blank' rel='noreferrer'
                      role='menuitem' className={dropdwonMenuStyles} onClick={() => setShowResources(false)}
                    >
                      {format('header.SDGFramework')}
                    </a>
                  </div>
                </div>
              </li>
              <li className='relative mt-2 lg:mt-0 text-right sm:mx-6 lg:mx-0'>
                <a
                  className={`${menuItemStyles} lg:mb-0 mb-2 inline`} ref={resourcePopoverButton}
                  href='aboutMenu' onClick={(e) => toggleAboutSwitcher(e)}
                >
                  {format('header.about')}
                  {
                    showAbout ? <HiChevronUp className='ml-1 inline text-2xl' /> : <HiChevronDown className='ml-1 inline text-2xl' />
                  }
                </a>
                <div className={`${showAbout ? 'block' : 'hidden'} ${dropdownPanelStyles}`} ref={resourcePopover} role='menu'>
                  <div className='py-1' role='none'>
                    <Link href='/about'>
                      <a href='/about' role='menuitem' className={dropdwonMenuStyles}>
                        {format('header.about')}
                      </a>
                    </Link>
                    <a
                      href='//solutions-catalog.atlassian.net/wiki/spaces/SOLUTIONS/overview' target='_blank' rel='noreferrer'
                      role='menuitem' className={dropdwonMenuStyles} onClick={() => setShowAbout(false)}
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
                        {session.user.canEdit && (<AdminMenu />)}
                      </li>
                      <li className='relative mt-2 lg:mt-0 text-right sm:mx-6 lg:mx-0'>
                        <UserMenu />
                      </li>
                    </>
                    )
                  : (
                    <li className='relative mt-2 lg:mt-0 text-right sm:mx-6 lg:mx-0'>
                      <a className={`${menuItemStyles}`} href='/sign-in' onClick={signInUser}>
                        {format('header.signIn')}
                      </a>
                    </li>
                    )
              }
              <li className='relative mt-2 lg:mt-0 text-right sm:mx-6 lg:mx-0'>
                <a
                  className={`${menuItemStyles} lg:mb-0 mb-2`}
                  href={`https://docs.osc.dial.community/projects/product-registry/${locale}/latest/`}
                  target='_blank' rel='noreferrer'
                >
                  {format('header.help')}
                </a>
              </li>
              <li><div className='border border-gray-400 border-t-0 lg:border-l-0 lg:h-9' /></li>
              <li className='relative mt-2 lg:mt-0 text-right sm:mx-6 lg:mx-0'>
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
                    <a href='fr' role='menuitem' className={dropdwonMenuStyles} onClick={(e) => switchLanguage(e, 'cs')}>
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
