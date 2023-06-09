import { useIntl } from 'react-intl'
import Link from 'next/link'
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri'
import { signIn, signOut } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '../lib/hooks'

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
      },
      {
        label: 'header.SDGFramework',
        link: '//digitalimpactalliance.org/research/sdg-digital-investment-framework/',
        external: true
      }
    ]
  },
  'header.marketplace': {
    type: 'link',
    items: [
      {
        label: 'opportunity.header',
        link: '/opportunities'
      },
      {
        label: 'storefront.header',
        link: '/storefronts'
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
        label: 'dataset.header',
        link: '/datasets'
      },
      {
        label: 'project.header',
        link: '/projects'
      },
      {
        label: 'playbook.header',
        link: '/playbooks'
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
      <a className='mx-8' href={link} target='_blank' rel='noreferrer' onClick={closeMenu}>
        {format(label)}
      </a>
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
      <Link href={link} className='mx-8' onClick={closeMenu}>
        {format(label)}
      </Link>
    </li>
  )
}

const SubMenu = ({ menuExpanded, setMenuExpanded, parent, setParent }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const { pathname, asPath, query } = useRouter()
  const router = useRouter()

  const { user, isAdminUser } = useUser()

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

  return (
    <>
      {
        parent &&
          <ul className='block xl:hidden mt-6 text-sm text-dial-white-beech' style={{ minHeight: user ? '405px' : '370px' }}>
            <li className='py-4 border-b'>
              <a className='mx-3 font-semibold' href='/main-menu' onClick={transitionToParent}>
                <RiArrowLeftSLine className='inline mr-2 text-base' />
                {format('header.mainMenu')}
              </a>
            </li>
            <li className='py-3'>
              <div className='mx-8 font-semibold'>
                {parent === 'current.user' ? user.userName.toUpperCase() : format(parent)}
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
                } else if (subMenus[parent].type === 'admin' && isAdminUser) {
                  return (
                    <li key={index} className='py-4 border-b'>
                      <Link href='/users' role='menuitem' className='mx-8'>
                        {format('header.admin.users')}
                      </Link>
                    </li>
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

  const { user } = useUser()

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
          <ul className='block lg:hidden mt-6 text-sm text-dial-white-beech' style={{ minHeight: user ? '405px' : '370px' }}>
            <li className='py-4 border-b'>
              <a
                className='mx-6 font-semibold' href='/expand-marketplace'
                onClick={(e) => openSubMenu(e, 'header.marketplace')}
              >
                {format('header.marketplace')}
                <RiArrowRightSLine className='text-base inline ml-2' />
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
              <Link href='wizard' className='mx-6 font-semibold'>
                {format('header.wizard')}
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
              <Link className='mx-6 font-semibold' href='about'>
                {format('header.about')}
              </Link>
            </li>
            {
              user
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
                        className='mx-2 inline bg-dial-biscotti pl-2 pr-3 py-3 rounded font-semibold'
                        href='signOut' onClick={(e) => openSubMenu(e, 'current.user')}
                      >
                        <img src='/icons/user.svg' className='inline mx-2' alt='Back' height='20px' width='20px' />
                        <div className='inline text-sm'>
                          {user.userName.toLowerCase()}
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
            <li className='py-4 border-b'>
              <a
                className='mx-6 font-semibold'
                href={`https://docs.dial.community/projects/product-registry/${locale}/latest/`}
                target='_blank' rel='noreferrer'
              >
                {format('header.help')}
              </a>
            </li>
            <li className='py-4'>
              <a
                className='mx-6 font-semibold' href='/switch-language'
                onClick={(e) => openSubMenu(e, 'header.selectLanguage')}
              >
                {format('header.selectLanguage')}
                <RiArrowRightSLine className='text-base inline ml-2 text-base' />
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
