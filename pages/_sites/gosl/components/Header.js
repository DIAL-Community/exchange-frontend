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