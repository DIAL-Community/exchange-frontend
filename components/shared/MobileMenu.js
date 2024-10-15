import { signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri'
import { FormattedMessage, useIntl } from 'react-intl'
import { useUser } from '../../lib/hooks'
import { SiteSettingContext } from '../context/SiteSettingContext'
import { HELP_MENU, LANGUAGE_MENU, NONE, RESOURCE_MENU, USER_MENU } from './menu/MenuCommon'

const GenericMenu = ({ menuConfiguration, currentMenu, setCurrentMenu }) => {
  const { id, name, destinationUrl, external, menuItemConfigurations } = menuConfiguration

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, { ...values }), [formatMessage])

  const toggleSubMenu = () => {
    setCurrentMenu(currentMenu === id ? NONE : id)
  }

  const internalLinkRenderer = (id, name, destinationUrl) =>
    <li key={`mobile-nav-${id}`}>
      <Link href={`/${destinationUrl}`}>
        <div className='flex flex-row gap-x-2 px-8 py-4'>
          {format(name)}
        </div>
      </Link>
    </li>

  const externalLinkRenderer = (id, name, destinationUrl) =>
    <li key={`mobile-nav-${id}`}>
      <a href={`//${destinationUrl}`} target='_blank' rel='noopener noreferrer'>
        <div className='flex flex-row gap-x-2 px-8 py-4'>
          {format(name)}
        </div>
      </a>
    </li>

  return (
    <li>
      <a
        id={id}
        href={destinationUrl
          ? external
            ? `//${destinationUrl}`
            : `/${destinationUrl}`
          : id
        }
        onClick={(e) => {
          e.preventDefault()
          toggleSubMenu()
        }}
      >
        <div className='flex flex-row gap-x-2 mx-8 py-4'>
          {format(name)}
          {menuItemConfigurations.length > 0 &&
            (currentMenu === id
              ? <RiArrowUpSLine className='text-base inline my-auto' />
              : <RiArrowDownSLine className='text-base inline my-auto' />
            )
          }
        </div>
      </a>
      {currentMenu === id && menuItemConfigurations.length > 0 &&
        <ul className='px-6'>
          {menuItemConfigurations.map(({ id, name, external, destinationUrl }) => {
            return external
              ? externalLinkRenderer(id, name, destinationUrl)
              : internalLinkRenderer(id, name, destinationUrl)
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
                <Link href='/users/me'>
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
    label: 'header.coc',
    link: '//digital-impact-exchange.atlassian.net/wiki/spaces/SOLUTIONS' +
          '/pages/541917207/Community+Code+of+Conduct/'
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
              {external
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
              <a
                onClick={(e) => {
                  e.preventDefault()
                  switchLanguage(e, locale)
                }}
              >
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

const MobileMenu = ({ menuExpanded }) => {
  const { user } = useUser()
  const { menuConfigurations } = useContext(SiteSettingContext)

  const [currentMenu, setCurrentMenu] = useState(NONE)

  return (
    <>
      {menuExpanded &&
        <div className='absolute top-16 right-0 w-full max-w-md'>
          <div className='shadow-lg bg-dial-iris-blue text-white cursor-pointer'>
            <ul className='flex flex-col max-h-[640px] lg:max-h-full overflow-auto py-4'>
              {menuConfigurations.map((menuConfiguration) => {
                switch (menuConfiguration.type) {
                  case 'menu.item':
                  case 'menu':
                    return (
                      <GenericMenu
                        menuConfiguration={menuConfiguration}
                        currentMenu={currentMenu}
                        setCurrentMenu={setCurrentMenu}
                      />
                    )
                  case 'locked.help.menu':
                    return <HelpMenu currentMenu={currentMenu} setCurrentMenu={setCurrentMenu} />
                  case 'locked.language.menu':
                    return <LanguageMenu currentMenu={currentMenu} setCurrentMenu={setCurrentMenu} />
                  case 'locked.login.menu':
                    return user
                      ? (
                        <li key='logged-in-menu' className='relative text-right intro-signup'>
                          <UserMenu currentOpenMenu={currentMenu} setCurrentMenu={setCurrentMenu} />
                        </li>
                      )
                      : (
                        <li key='sign-in-menu' className='text-right px-3'>
                          <button type='button' className='border border-white rounded-md w-full' onClick={signIn}>
                            <div className='py-2.5'>
                              <FormattedMessage id='header.signIn' />
                            </div>
                          </button>
                        </li>
                      )
                  case 'locked.admin.menu':
                    return null
                  default:
                    return null
                }
              })}
            </ul>
          </div>
        </div>
      }
    </>
  )
}

export default MobileMenu
