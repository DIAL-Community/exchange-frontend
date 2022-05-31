import Link from 'next/link'

const Header = () => {
  return (
    <header className='z-70 sticky top-0 border-b-2 border-dial-gray-dark bg-white'>
      <div className='flex flex-wrap justify-center items-center py-3 lg:py-0 max-w-catalog header-min-height mx-auto'>
        <div className='flex-1 flex my-auto'>
          <Link href='/'>
            <div className='px-12 lg:px-16 my-4 text-blue-900 hover:cursor-pointer'>
              <img src='images/gosl/GoSL.png' alt='Government of Sierra Leone' height='100' width='100' />
            </div>
          </Link>
          <div className='dropdown'>
            <div className='text-blue-900 text-xl hover:bg-green-500 hover:text-white hover:cursor-pointer font-semibold flex items-center justify-center px-4 m-5'>Ministries <svg className='w-4 h-4 ml-2' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'></path></svg></div>
            <div className='dropdown-menu z-10 hidden bg-white divide-y divide-gray-100 rounded shadow w-44 dark:bg-gray-700'>
              <ul className='py-1 text-sm text-gray-700 dark:text-gray-200' aria-labelledby='dropdownDefault'>
                <li>
                  <a href='/ministries/mic' className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>Dashboard</a>
                </li>
                <li>
                  <a href='#' className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>Settings</a>
                </li>
                <li>
                  <a href='#' className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>Earnings</a>
                </li>
              </ul>
            </div>
          </div>
          <Link href='/ministries'>
            <div className='text-blue-900 text-xl hover:bg-green-500 hover:text-white hover:cursor-pointer font-semibold flex items-center justify-center px-4 m-5'>Ministries</div>
          </Link>
          <Link href='/ea'>
            <div className='text-blue-900 text-xl hover:bg-green-500 hover:text-white hover:cursor-pointer font-semibold flex items-center justify-center px-4 m-5'>Enterprise Architecture</div>
          </Link>
          <Link href='/products'>
            <div className='text-blue-900 text-xl hover:bg-green-500 hover:text-white hover:cursor-pointer font-semibold flex items-center justify-center px-4 m-5'>Digital Tools</div>
          </Link>
          <Link href='/procurement'>
            <div className='text-blue-900 text-xl hover:bg-green-500 hover:text-white hover:cursor-pointer font-semibold flex items-center justify-center px-4 m-5'>Procurement</div>
          </Link>
          <Link href='/blog'>
            <div className='text-blue-900 text-xl hover:bg-green-500 hover:text-white hover:cursor-pointer font-semibold flex items-center justify-center px-4 m-5'>Blog</div>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header