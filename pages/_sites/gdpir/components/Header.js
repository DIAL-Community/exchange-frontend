/* eslint-disable max-len */
import Link from 'next/link'
import { useState } from 'react'
import { NONE } from '../../../../components/shared/menu/MenuCommon'
import CountriesMenu from '../../../../components/shared/menu/Countries'

const Header = () => {
  const [currentOpenMenu, setCurrentOpenMenu] = useState(NONE)

  const toggleDropdownSwitcher = (expectedMenuItem) => {
    setCurrentOpenMenu(currentOpenMenu === expectedMenuItem ? NONE : expectedMenuItem)
  }

  return (
    <header className='z-70 sticky top-0 border-b-2 border-dial-gray-dark bg-white'>
      <div className='flex flex-wrap justify-center items-center py-3 lg:py-0 max-w-catalog header-min-height mx-auto'>
        <div className='flex-1 flex my-auto'>
          <Link href='/'>
            <div className='px-12 lg:px-16 my-4 text-blue-900 hover:cursor-pointer'>
              Global Digital Public<br />Infrastructure Repository
            </div>
          </Link>
          <ul className='hidden xl:flex ml-80'>
            <li className='text-blue-900 text-xl hover:text-blue-600 font-semibold relative text-right px-4 m-5'>
              <CountriesMenu currentOpenMenu={currentOpenMenu} onToggleDropdown={toggleDropdownSwitcher} />
            </li>
          </ul>
          <Link href='/products'>
            <div className='text-blue-900 text-xl hover:text-blue-600 hover:cursor-pointer font-semibold flex items-center justify-center px-4 m-5'>Products</div>
          </Link>
          <Link href='/playbooks'>
            <div className='text-blue-900 text-xl hover:text-blue-600 hover:cursor-pointer font-semibold flex items-center justify-center px-4 m-5'>Playbooks</div>
          </Link>
          <Link href='/resources'>
            <div className='text-blue-900 text-xl hover:text-blue-600 hover:cursor-pointer font-semibold flex items-center justify-center px-4 m-5'>Resources</div>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
