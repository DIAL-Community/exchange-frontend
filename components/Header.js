import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/client'
import { useIntl } from 'react-intl'

const Header = () => {
  const [session] = useSession()
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  return (
    <nav className='flex items-center justify-between flex-wrap bg-white p-6 w-full border-solid border-b-2 border-dialyellow'>
      <Link href='/'>
        <a className='font-semibold text-xl tracking-tight text-dialblue-darkest float-left'>Catalog of Digital Solutions</a>
      </Link>
      <div className='w-full block lg:w-auto float-right'>
        <Link href='/wizard'>
          <a className='pr-2'>Wizard</a>
        </Link>
        <div className='float-right'>
          {
            !session &&
              <>
                Not signed in <br />
                <button onClick={() => signIn()}>{format('header.signIn')}</button>
              </>
          }
          {
            session &&
              <>
                Signed in as {session.user.email} <br />
                <button onClick={() => signOut()}>{format('header.signOut')}</button>
              </>
          }
        </div>
      </div>
    </nav>
  )
}

export default Header
