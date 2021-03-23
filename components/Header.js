import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, createRef } from 'react'
import { signIn, signOut, useSession } from 'next-auth/client'
import { useIntl } from 'react-intl'
import { HiChevronDown } from 'react-icons/hi'
import { createPopper } from '@popperjs/core'

const LanguageDropdown = () => {
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false)
  const { pathname, asPath, query } = useRouter()
  const router = useRouter()
  const btnDropdownRef = createRef()
  const popoverDropdownRef = createRef()
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: 'bottom'
    })
    setDropdownPopoverShow(true)
  }
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false)
  }
  return (
    <>
      <div className='relative w-full'>
        <a
          className='flex justify-center text-buttongray text-buttongray text-sm pr-1 focus:outline-none ease-linear transition-all duration-150'
          ref={btnDropdownRef}
          onClick={() => {
            dropdownPopoverShow
              ? closeDropdownPopover()
              : openDropdownPopover()
          }}
        >
          {format('header.selectLanguage')}
          <HiChevronDown />
        </a>
        <div
          ref={popoverDropdownRef}
          className={
            (dropdownPopoverShow ? 'block ' : 'hidden ') + 'bg-dialgray-light ' +
            'text-base z-50 float-left py-2 list-none text-left rounded shadow-lg mt-1'
          }
          style={{ minWidth: '10rem' }}
        >
          <a
            href='#english'
            className='text-sm py-2 px-4 font-normal block w-full whitespace-nowrap text-buttongray'
            onClick={(e) => {
              e.preventDefault()
              router.push({ pathname, query }, asPath, { locale: 'en' })
            }}
          >
            {format('header.english')}
          </a>
          <a
            href='#german'
            className='text-sm py-2 px-4 font-normal block w-full whitespace-nowrap text-buttongray'
            onClick={(e) => {
              e.preventDefault()
              router.push({ pathname, query }, asPath, { locale: 'de' })
            }}
          >
            {format('header.german')}
          </a>
          <a
            href='#frenchg'
            className='text-sm py-2 px-4 font-normal block w-full whitespace-nowrap text-buttongray'
            onClick={(e) => {
              e.preventDefault()
              router.push({ pathname, query }, asPath, { locale: 'fr' })
            }}
          >
            {format('header.french')}
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

  return (
    <nav className='bg-white header align-middle w-full py-2 border-solid border-b-2 border-dialyellow'>
      <Link href='/'>
        <a className='tracking-tight float-left text-dialblue-darkest'>
          <div>Digital Impact Alliance</div>
          <div className='font-bold text-xl'>Catalog of Digital Solutions</div>
        </a>
      </Link>
      <div className='flex items-center h-full justify-between flex-wrap float-right w-3/5 text-dialblue-darkest'>
        <Link href='/wizard'>
          <a>{format('header.covidResources')}</a>
        </Link>
        <Link href='/wizard'>
          <a>{format('header.about')}</a>
        </Link>
        {
          !session &&
            <>
              <button onClick={() => signIn()}>{format('header.signIn')}</button>
            </>
        }
        {
          session &&
            <>
              <button onClick={() => signOut()}>{session.user.email}</button>
            </>
        }
        <Link href='/wizard'>
          <a>{format('header.help')}</a>
        </Link>
        <div className='dropdown w-1/4 flex justify-center border-l border-buttongray'>
          <LanguageDropdown />
        </div>
      </div>
    </nav>
  )
}

export default Header
