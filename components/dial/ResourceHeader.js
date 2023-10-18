import Link from 'next/link'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'

const ResourceHeader = ({ isOnAuthPage = false }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, { ...values }), [formatMessage])

  const [menuExpanded, setMenuExpanded] = useState(false)

  const toggleMobileMenu = () => {
    setMenuExpanded(!menuExpanded)
  }

  return (
    <header className='z-50 sticky top-0 bg-dial-stratos max-w-catalog mx-auto'>
      <div className='flex flex-wrap header-min-height px-4 lg:px-8 xl:px-56 text-sm'>
        <a href='dial.global' className='w-32 my-auto'>
          <img
            src='/ui/v1/dial-header.svg'
            alt={format('ui.image.logoAlt', { name: 'Digital Impact Alliance Logo' })}
          />
        </a>
        <HamburgerMenu menuExpanded={menuExpanded} onMenuClicked={toggleMobileMenu} />
        <ul className='hidden md:flex items-center ml-auto text-dial-white-beech gap-x-12'>
          {!isOnAuthPage &&
            <>
              <li className='text-xl relative text-right intro-resource'>
                <a
                  href='//dial.global/about-the-digital-impact-alliance'
                  className='text-white hover:text-dial-sunshine'
                >
                  About
                </a>
              </li>
              <li className='text-xl relative text-right intro-resource'>
                <a
                  href='//dial.global/our-work/'
                  className='text-white hover:text-dial-sunshine'
                >
                  Work
                </a>
              </li>
              <li className='text-xl relative text-right intro-resource'>
                <Link
                  href='/resources/dial'
                  className='text-white hover:text-dial-sunshine'
                >
                  Resource Hub
                </Link>
              </li>
              <li className='text-xl relative text-right intro-resource'>
                <a
                  href='//dial.global/about-the-digital-impact-alliance/contact-us'
                  className='text-white hover:text-dial-sunshine'
                >
                  Contact
                </a>
              </li>
            </>
          }
        </ul>
      </div>
      <MobileMenu menuExpanded={menuExpanded} setMenuExpanded={setMenuExpanded} />
    </header>
  )
}

const MobileMenu = ({ menuExpanded, setMenuExpanded }) => {

  return (
    <>
      {menuExpanded &&
        <div className='absolute top-22 right-0 w-full max-w-md'>
          <div className='shadow-lg bg-dial-iris-blue text-white cursor-pointer'>
            <ul className='flex flex-col gap-y-8 px-6 py-8 max-h-[640px] lg:max-h-full overflow-auto'>
              <li className='text-xl relative intro-resource'>
                <a
                  href='//dial.global/our-work/'
                  className='text-white hover:text-dial-sunshine'
                >
                  Work
                </a>
              </li>
              <li className='text-xl relative'>
                <Link
                  onClick={() => setMenuExpanded(false)}
                  href='/resources/dial'
                  className='text-white hover:text-dial-sunshine'
                >
                  Resources
                </Link>
              </li>
              <li className='text-xl relative'>
                <a
                  href='//dial.global'
                  className='text-white hover:text-dial-sunshine'
                >
                  Latest
                </a>
              </li>
            </ul>
          </div>
        </div>
      }
    </>
  )
}

const HamburgerMenu = ({ menuExpanded, onMenuClicked }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, { ...values }), [formatMessage])

  return (
    <>
      <label
        htmlFor='burger'
        className='ml-auto my-auto cursor-pointer block md:hidden z-30'
      >
        <svg
          className='fill-current text-white'
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          viewBox='0 0 20 20'
        >
          <title>{format('app.menu')}</title>
          <path d='M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z' />
        </svg>
      </label>
      <input
        id='burger'
        type='checkbox'
        className='hidden'
        checked={menuExpanded}
        onChange={onMenuClicked}
      />
    </>
  )
}

export default ResourceHeader
