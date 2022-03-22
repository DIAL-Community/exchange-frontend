import { useIntl } from 'react-intl'
import Link from 'next/link'

import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri'
import { signIn, signOut, useSession } from 'next-auth/client'
import { useState } from 'react'
import { useRouter } from 'next/router'

const subMenus = {
  'admin.links': {
    type: 'admin',
    items: [
      {
        label: 'admin.links'
      }
    ]
  },
  'current.user': {
    type: 'session',
    items: [
      {
        label: 'header.signOut'
      }
    ]
  },
  'header.selectLanguage': {
    type: 'language',
    items: [
      {
        label: 'header.german',
        locale: 'de'
      },
      {
        label: 'header.english',
        locale: 'en'
      },
      {
        label: 'header.french',
        locale: 'fr'
      },
      {
        label: 'header.portuguese',
        locale: 'pt'
      },
      {
        label: 'header.spanish',
        locale: 'es'
      },
      {
        label: 'header.swahili',
        locale: 'sw'
      },
      {
        label: 'header.czech',
        locale: 'cs'
      }
    ]
  },
  'header.resources': {
    type: 'link',
    items: [
      {
        label: 'header.covidResources',
        link: '/covid-19-resources'
      },
      {
        label: 'header.dialResourcesPortal',
        link: '//resources.dial.community/',
        external: true
      }
    ]
  },
  'header.catalog': {
    type: 'link',
    items: [
      {
        label: 'sdg.header',
        link: '/sdgs'
      },
      {
        label: 'useCase.header',
        link: '/use_cases'
      },
      {
        label: 'workflow.header',
        link: '/workflows'
      },
      {
        label: 'building-block.header',
        link: '/building_blocks'
      },
      {
        label: 'product.header',
        link: '/products'
      },
      {
        label: 'project.header',
        link: '/projects'
      },
      {
        label: 'map.header',
        link: '/maps/projects'
      }
    ]
  }
}

const ExternalLink = ({ menuExpanded, setMenuExpanded, link, label }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const closeMenu = () => {
    setMenuExpanded(!menuExpanded)
  }

  return (
    <li className='py-3'>
      <Link href={link}>
        <a className='mx-8' href={link} target='_blank' rel='noreferrer' onClick={closeMenu}>
          {format(label)}
        </a>
      </Link>
    </li>
  )
}

const InternalLink = ({ menuExpanded, setMenuExpanded, link, label }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const closeMenu = () => {
    setMenuExpanded(!menuExpanded)
  }

  return (
    <li className='py-3'>
      <Link href={link}>
        <a className='mx-8' href={link} onClick={closeMenu}>
          {format(label)}
        </a>
      </Link>
    </li>
  )
}

const SubMenu = ({ menuExpanded, setMenuExpanded, parent, setParent }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const [session] = useSession()
  const { pathname, asPath, query } = useRouter()
  const router = useRouter()

  const switchLanguage = (e, localeCode) => {
    e.preventDefault()
    setMenuExpanded(!menuExpanded)
    router.push({ pathname, query }, asPath, { locale: localeCode })
  }

  const transitionToParent = (e) => {
    e.preventDefault()
    setParent('')
  }

  const signOutUser = (e) => {
    e.preventDefault()
    setMenuExpanded(!menuExpanded)
    signOut()
  }

  const closeMenu = () => {
    setMenuExpanded(!menuExpanded)
  }

  return (
    <>
      {
        parent &&
          <ul className='block lg:hidden mt-6 text-sm' style={{ minHeight: session ? '405px' : '370px' }}>
            <li className='py-4 border-b'>
              <a className='mx-3 font-semibold' href='/main-menu' onClick={transitionToParent}>
                <RiArrowLeftSLine className='inline mr-2 text-base' />
                {format('header.mainMenu')}
              </a>
            </li>
            <li className='py-3'>
              <div className='mx-8 font-semibold'>
                {parent === 'current.user' ? session.user && session.user.userName && session.user.userName.toUpperCase() : format(parent)}
              </div>
            </li>
            {
              subMenus[parent].items.map((item, index) => {
                if (subMenus[parent].type === 'link') {
                  return item.external
                    ? <ExternalLink key={index} {...{ menuExpanded, setMenuExpanded }} link={item.link} label={item.label} />
                    : <InternalLink key={index} {...{ menuExpanded, setMenuExpanded }} link={item.link} label={item.label} />
                } else if (subMenus[parent].type === 'language') {
                  return (
                    <li key={index} className='py-4 border-b'>
                      <a
                        className='mx-8' href={`/switch-${item.locale}`}
                        onClick={(e) => switchLanguage(e, item.locale)}
                      >
                        {format(item.label)}
                      </a>
                    </li>
                  )
                } else if (subMenus[parent].type === 'session') {
                  return (
                    <li key={index} className='py-4 border-b'>
                      <a className='mx-8' href='/sign-out' onClick={signOutUser}>
                        {format(item.label)}
                      </a>
                    </li>
                  )
                } else if (subMenus[parent].type === 'admin' && session.user) {
                  const { userEmail, userToken } = session.user.user
                  return (
                    <>
                      <li key={index} className='py-4 border-b'>
                        <a
                          href={`${process.env.NEXT_PUBLIC_RAILS_SERVER}/users?user_email=${userEmail}&user_token=${userToken}`}
                          className='mx-8' onClick={closeMenu}
                        >
                          {format('header.admin.users')}
                        </a>
                      </li>
                      <li key={index} className='py-4 border-b'>
                        <a
                          href={`${process.env.NEXT_PUBLIC_RAILS_SERVER}/settings?user_email=${userEmail}&user_token=${userToken}`}
                          className='mx-8' onClick={closeMenu}
                        >
                          {format('header.admin.settings')}
                        </a>
                      </li>
                    </>
                  )
                }
                return null
              })
            }
          </ul>
      }
    </>
  )
}

const MainMenu = ({ menuExpanded, setMenuExpanded, parent, setParent }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })
  const { locale } = useRouter()

  const [session] = useSession()

  const openSubMenu = (e, selectedParent) => {
    e.preventDefault()
    setParent(selectedParent)
  }

  const signInUser = (e) => {
    e.preventDefault()
    setMenuExpanded(!menuExpanded)
    signIn()
  }

  return (
    <>
      {
        !parent &&
          <ul className='block lg:hidden mt-6 text-sm' style={{ minHeight: session ? '405px' : '370px' }}>
            <li className='py-4 border-b'>
              <a
                className='mx-6 font-semibold' href='/switch-language'
                onClick={(e) => openSubMenu(e, 'header.selectLanguage')}
              >
                {format('header.selectLanguage')}
                <RiArrowRightSLine className='text-base inline ml-2 text-base' />
              </a>
            </li>
            <li className='py-4 border-b'>
              <a
                className='mx-6 font-semibold' href='/expand-catalog'
                onClick={(e) => openSubMenu(e, 'header.catalog')}
              >
                {format('header.catalog')}
                <RiArrowRightSLine className='text-base inline ml-2' />
              </a>
            </li>
            <li className='py-4 border-b'>
              <Link href='wizard'>
                <a className='mx-6 font-semibold' href='about'>{format('header.wizard')}</a>
              </Link>
            </li>
            <li className='py-4 border-b'>
              <a
                className='mx-6 font-semibold' href='/expand-resources'
                onClick={(e) => openSubMenu(e, 'header.resources')}
              >
                {format('header.resources')}
                <RiArrowRightSLine className='text-base inline ml-2' />
              </a>
            </li>
            <li className='py-4 border-b'>
              <Link href='about'>
                <a className='mx-6 font-semibold' href='about'>{format('header.about')}</a>
              </Link>
            </li>
            {
              session
                ? (
                  <>
                    <li className='py-4 border-b font-semibold'>
                      <a className='mx-6 font-semibold' href='/admin' onClick={(e) => openSubMenu(e, 'admin.links')}>
                        {format('header.admin')}
                        <RiArrowRightSLine className='text-base inline ml-2' />
                      </a>
                    </li>
                    <li className='py-4 border-b'>
                      <a
                        className='mx-2 inline bg-dial-yellow-light pl-2 pr-3 py-3 rounded font-semibold'
                        href='signOut' onClick={(e) => openSubMenu(e, 'current.user')}
                      >
                        <img src='/icons/user.svg' className='inline mx-2' alt='Back' height='20px' width='20px' />
                        <div className='inline text-sm'>
                          {session.user && session.user.userName && session.user.userName.toUpperCase()}
                        </div>
                        <RiArrowRightSLine className='text-base inline ml-2' />
                      </a>
                    </li>
                  </>
                  )
                : (
                  <li className='py-4 border-b font-semibold'>
                    <a className='mx-6 font-semibold' href='/sign-in' onClick={signInUser}>
                      {format('header.signIn')}
                    </a>
                  </li>
                  )
            }
            <li className='py-4'>
              <a
                className='mx-6 font-semibold'
                href={`https://docs.osc.dial.community/projects/product-registry/${locale}/latest/`}
                target='_blank' rel='noreferrer'
              >
                {format('header.help')}
              </a>
            </li>
          </ul>
      }
    </>
  )
}

const MobileMenu = ({ menuExpanded, setMenuExpanded }) => {
  const [parent, setParent] = useState('')

  return (
    <>
      <MainMenu {...{ menuExpanded, setMenuExpanded }} parent={parent} setParent={setParent} />
      <SubMenu {...{ menuExpanded, setMenuExpanded }} parent={parent} setParent={setParent} />
    </>
  )
}

export default MobileMenu
