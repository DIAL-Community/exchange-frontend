import Link from 'next/link'
import { useIntl } from 'react-intl'
import { signIn, signOut } from 'next-auth/react'
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri'
import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '../../../lib/hooks'
import { SUPPORTING_NAVIGATION_ITEMS, TOOL_NAVIGATION_ITEMS } from '../utils/header'
import { HELP_MENU, LANGUAGE_MENU, MARKETPLACE_MENU, NONE, RESOURCE_MENU, USER_MENU } from './menu/MenuCommon'

const MarketplaceMenu = ({ currentMenu, setCurrentMenu }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, { ...values }), [formatMessage])

  const toggleSubMenu = () => {
    setCurrentMenu(currentMenu === MARKETPLACE_MENU ? NONE : MARKETPLACE_MENU)
  }

  const MARKETPLACE_MENU_ITEMS = [{
    label: 'ui.opportunity.header',
    link: '/opportunities'
  }, {
    label: 'ui.storefront.header',
    link: '/storefronts'
  }]

  return (
    <li>
      <a
        href='tool'
        id={MARKETPLACE_MENU}
        onClick={(e) => {
          e.preventDefault()
          toggleSubMenu()
        }}
      >
        <div className='flex flex-row gap-x-2 mx-8 py-4'>
          {format('header.marketplace')}
          {currentMenu === MARKETPLACE_MENU
            ? <RiArrowUpSLine className='text-base inline my-auto' />
            : <RiArrowDownSLine className='text-base inline my-auto' />
          }
        </div>
      </a>
      {currentMenu === MARKETPLACE_MENU &&
        <ul className='px-6'>
          {MARKETPLACE_MENU_ITEMS.map(({ label, link }) => {
            return (
              <li key={`mobile-nav-${label}`}>
                <Link href={`/${link}`}>
                  <div className='flex flex-row gap-x-2 px-8 py-4'>
                    {format(label)}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      }
    </li>
  )
}

const ToolMenu = ({ currentMenu, setCurrentMenu }) => {
  const TOOL_MENU = 'menu-tool'

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, { ...values }), [formatMessage])

  const toggleSubMenu = () => {
    setCurrentMenu(currentMenu === TOOL_MENU ? NONE : TOOL_MENU)
  }

  return (
    <li>
      <a
        href='tool'
        id={TOOL_MENU}
        onClick={(e) => {
          e.preventDefault()
          toggleSubMenu()
        }}
      >
        <div className='flex flex-row gap-x-2 mx-8 py-4'>
          {format('header.tools')}
          {currentMenu === TOOL_MENU
            ? <RiArrowUpSLine className='text-base inline my-auto' />
            : <RiArrowDownSLine className='text-base inline my-auto' />
          }
        </div>
      </a>
      {currentMenu === TOOL_MENU &&
        <ul className='px-6'>
          {Object.entries(TOOL_NAVIGATION_ITEMS).map(([key, value]) => {
            return (
              <li key={`mobile-nav-${key}`}>
                <Link href={`/${value}`}>
                  <div className='flex flex-row gap-x-2 px-8 py-4'>
                    {format(key)}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      }
    </li>
  )
}

const SupportingMenu = ({ currentMenu, setCurrentMenu }) => {
  const SUPPORTING_MENU = 'menu-supporting'

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, { ...values }), [formatMessage])

  const toggleSubMenu = () => {
    setCurrentMenu(currentMenu === SUPPORTING_MENU ? NONE : SUPPORTING_MENU)
  }

  return (
    <li>
      <a
        href='supporting-tool'
        id={SUPPORTING_MENU}
        onClick={(e) => {
          e.preventDefault()
          toggleSubMenu()
        }}
      >
        <div className='flex flex-row gap-x-2 mx-8 py-4'>
          {format('header.supportingTools')}
          {currentMenu === SUPPORTING_MENU
            ? <RiArrowUpSLine className='text-base inline my-auto' />
            : <RiArrowDownSLine className='text-base inline my-auto' />
          }
        </div>
      </a>
      {currentMenu === SUPPORTING_MENU &&
        <ul className='px-6'>
          {Object.entries(SUPPORTING_NAVIGATION_ITEMS).map(([key, value]) => {
            return (
              <li key={`mobile-nav-${key}`}>
                <Link href={`/${value}`}>
                  <div className='flex flex-row gap-x-2 px-8 py-4'>
                    {format(key)}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      }
    </li>
  )
}

const ResourceMenu = ({ currentMenu, setCurrentMenu }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, { ...values }), [formatMessage])

  const toggleSubMenu = () => {
    setCurrentMenu(currentMenu === RESOURCE_MENU ? NONE : RESOURCE_MENU)
  }

  const RESOURCES_MENU_ITEMS = [{
    label: 'header.covidResources',
    link: '/covid-19-resources'
  }, {
    label: 'header.dialResourcesPortal',
    link: '//resources.dial.community/',
    external: true
  }, {
    label: 'header.SDGFramework',
    link: '//digitalimpactalliance.org/research/sdg-digital-investment-framework/',
    external: true
  }, {
    label: 'header.blogs',
    link: '/resources'
  }]

  return (
    <li>
      <a
        href='access-resource'
        id={RESOURCE_MENU}
        onClick={(e) => {
          e.preventDefault()
          toggleSubMenu()
        }}
      >
        <div className='flex flex-row gap-x-2 mx-8 py-4'>
          {format('header.resources')}
          {currentMenu === RESOURCE_MENU
            ? <RiArrowUpSLine className='text-base inline my-auto' />
            : <RiArrowDownSLine className='text-base inline my-auto' />
          }
        </div>
      </a>
      {currentMenu === RESOURCE_MENU &&
        <ul className='px-6'>
          {RESOURCES_MENU_ITEMS.map(({ label, link, external }) => {
            return <li key={`mobile-nav-${label}`}>
              { external
                ? <a href={link} target='_blank' rel='noreferrer'>
                  <div className='flex flex-row gap-x-2 px-8 py-4'>
                    {format(label)}
                  </div>
                </a>
                : <Link href={`/${link}`}>
                  <div className='flex flex-row gap-x-2 px-8 py-4'>
                    {format(label)}
                  </div>
                </Link>
              }
            </li>
          })}
        </ul>
      }
    </li>
  )
}

const UserMenu = ({ currentMenu, setCurrentMenu }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, { ...values }), [formatMessage])

  const { user } = useUser()

  const toggleSubMenu = () => {
    setCurrentMenu(currentMenu === USER_MENU ? NONE : USER_MENU)
  }

  return (
    <>
      {user &&
        <li>
          <a
            href='user-menu'
            id={USER_MENU}
            onClick={(e) => {
              e.preventDefault()
              toggleSubMenu()
            }}
          >
            <div className='flex flex-row gap-x-2 mx-8 py-4'>
              <img src='/icons/user.svg' className='inline' alt='Back' height='30px' width='30px' />
              <div className='inline my-auto'>
                {user.userName.toLowerCase()}
              </div>
              {currentMenu === USER_MENU
                ? <RiArrowUpSLine className='text-base inline my-auto' />
                : <RiArrowDownSLine className='text-base inline my-auto' />
              }
            </div>
          </a>
          {currentMenu === USER_MENU &&
            <ul className='px-6'>
              <li>
                <Link href={`/users/${user.id}`}>
                  <div className='flex flex-row gap-x-2 px-8 py-4'>
                    {format('header.profile')}
                  </div>
                </Link>
              </li>
              <li>
                <button type='button' onClick={signOut} className='w-full text-left'>
                  <div className='mx-8 py-4'>
                    {format('header.signOut')}
                  </div>
                </button>
              </li>
            </ul>
          }
        </li>
      }
    </>
  )
}

const HelpMenu = ({ currentMenu, setCurrentMenu }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, { ...values }), [formatMessage])

  const { locale } = useRouter()

  const toggleSubMenu = () => {
    setCurrentMenu(currentMenu === HELP_MENU ? NONE : HELP_MENU)
  }

  const RESOURCES_MENU_ITEMS = [{
    label: 'header.about',
    link: '/about'
  }, {
    label: 'header.documentation',
    link: `https://docs.dial.community/projects/product-registry/${locale}/latest/`,
    external: true
  }, {
    label: 'header.confluence',
    link: '//solutions-catalog.atlassian.net/wiki/spaces/SOLUTIONS/overview',
    external: true
  }, {
    label: 'header.newsletter',
    link: '//digitalimpactalliance.us11.list-manage.com/subscribe?u=38fb36c13a6fa71469439b2ab&id=18657ed3a5',
    external: true
  }]

  return (
    <li>
      <a
        href='access-help'
        id={RESOURCE_MENU}
        onClick={(e) => {
          e.preventDefault()
          toggleSubMenu()
        }}
      >
        <div className='flex flex-row gap-x-2 mx-8 py-4'>
          {format('header.help')}
          {currentMenu === HELP_MENU
            ? <RiArrowUpSLine className='text-base inline my-auto' />
            : <RiArrowDownSLine className='text-base inline my-auto' />
          }
        </div>
      </a>
      {currentMenu === HELP_MENU &&
        <ul className='px-6'>
          {RESOURCES_MENU_ITEMS.map(({ label, link, external }) => {
            return <li key={`mobile-nav-${label}`}>
              { external
                ? <a href={link} target='_blank' rel='noreferrer'>
                  <div className='flex flex-row gap-x-2 px-8 py-4'>
                    {format(label)}
                  </div>
                </a>
                : <Link href={`/${link}`}>
                  <div className='flex flex-row gap-x-2 px-8 py-4'>
                    {format(label)}
                  </div>
                </Link>
              }
            </li>
          })}
        </ul>
      }
    </li>
  )
}

const LanguageMenu = ({ currentMenu, setCurrentMenu }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, { ...values }), [formatMessage])

  const router = useRouter()
  const { pathname, asPath, query } = router

  const toggleSubMenu = () => {
    setCurrentMenu(currentMenu === LANGUAGE_MENU ? NONE : LANGUAGE_MENU)
  }

  const switchLanguage = (e, localeCode) => {
    e.preventDefault()
    router.push({ pathname, query }, asPath, { locale: localeCode })
  }

  const LANGUAGE_MENU_ITEMS = [{
    label: 'header.german',
    locale: 'de'
  }, {
    label: 'header.english',
    locale: 'en'
  }, {
    label: 'header.french',
    locale: 'fr'
  }, {
    label: 'header.portuguese',
    locale: 'pt'
  }, {
    label: 'header.spanish',
    locale: 'es'
  }, {
    label: 'header.swahili',
    locale: 'sw'
  }, {
    label: 'header.czech',
    locale: 'cs'
  }]

  return (
    <li>
      <a
        href='update-language'
        id={LANGUAGE_MENU}
        onClick={(e) => {
          e.preventDefault()
          toggleSubMenu()
        }}
      >
        <div className='flex flex-row gap-x-2 mx-8 py-4'>
          Languages
          {currentMenu === LANGUAGE_MENU
            ? <RiArrowUpSLine className='text-base inline my-auto' />
            : <RiArrowDownSLine className='text-base inline my-auto' />
          }
        </div>
      </a>
      {currentMenu === LANGUAGE_MENU &&
        <ul className='px-6'>
          {LANGUAGE_MENU_ITEMS.map(({ label, locale }) => {
            return <li key={`mobile-nav-${locale}`}>
              <a onClick={(e) => switchLanguage(e, locale)} >
                <div className='flex flex-row gap-x-2 px-8 py-4'>
                  {format(label)}
                </div>
              </a>
            </li>
          })}
        </ul>
      }
    </li>
  )
}

const MobileMenu = ({ menuExpanded, setMenuExpaded }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, { ...values }), [formatMessage])

  const [currentMenu, setCurrentMenu] = useState(NONE)

  const { user } = useUser()

  const hideMenu = () => {
    setMenuExpaded(false)
  }

  return (
    <>
      {menuExpanded &&
        <div className='absolute top-16 right-0 w-full max-w-md'>
          <div className='shadow-lg bg-dial-iris-blue text-white cursor-pointer'>
            <ul className='flex flex-col max-h-[640px] lg:max-h-full overflow-auto py-4'>
              {!user &&
                <div className='mx-8 my-4'>
                  <button type='button' className='border border-white rounded-md w-full' onClick={signIn}>
                    <div className='py-2.5'>Login</div>
                  </button>
                </div>
              }
              <MarketplaceMenu {...{ currentMenu, setCurrentMenu, hideMenu }} />
              <ToolMenu {...{ currentMenu, setCurrentMenu, hideMenu }} />
              <SupportingMenu {...{ currentMenu, setCurrentMenu, hideMenu }} />
              <li>
                <Link href='wizard'>
                  <div className='flex flex-row gap-x-2 mx-8 py-4'>
                    {format('header.wizard')}
                  </div>
                </Link>
              </li>
              <ResourceMenu {...{ currentMenu, setCurrentMenu, hideMenu }} />
              <UserMenu {...{ currentMenu, setCurrentMenu, hideMenu }} />
              <HelpMenu {...{ currentMenu, setCurrentMenu, hideMenu }} />
              <LanguageMenu {...{ currentMenu, setCurrentMenu, hideMenu }} />
            </ul>
          </div>
        </div>
      }
    </>
  )
}

export default MobileMenu
