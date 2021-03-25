import Link from 'next/link'

import Header from '../../components/Header'

export default function Error ({ csrfToken }) {
  return (
    <>
      <Header />
      <div id='content' className='container-fluid with-header'>
        <h1 className='block'>Error in authentication</h1>
        <div className='flex items-center'>
          <Link href='/auth/signin'>
            <button className='bg-dial-gray-dark hover:bg-blue-dark text-dial-gray-light font-bold py-2 px-4 mx-2 rounded'>
              Try Again
            </button>
          </Link>
          <Link href='/'>
            <button className='bg-dial-gray-dark hover:bg-blue-dark text-dial-gray-light font-bold py-2 px-4 mx-2 rounded'>
              Go Back to Catalog
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}
