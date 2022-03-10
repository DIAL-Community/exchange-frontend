import Head from 'next/head'
import { useIntl } from 'react-intl'

import { useSession } from 'next-auth/client'

import Header from '../../components/Header'

import dynamic from 'next/dynamic'
import Footer from '../../components/Footer'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const UserProfile = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const [session] = useSession()

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <ReactTooltip className='tooltip-prose bg-gray-300 text-gray rounded' />
      {session &&
        <div className='flex flex-col lg:flex-row justify-between pb-8 max-w-catalog mx-auto'>
          <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
            <div className='bg-white border-2 border-dial-gray lg:mr-6 shadow-lg'>
              <div className='flex flex-col h-80 p-4'>
                <div className='text-2xl font-semibold absolute w-4/5 md:w-auto lg:w-64 2xl:w-80 bg-white bg-opacity-80 text-dial-purple'>
                  {format('profile.username')} : {session.user.name}
                </div>
                <div className='pt-8 m-auto align-middle w-48'>
                  <img
                    alt={format('image.alt.logoFor', { name: session.user.name })}
                    src={session.user.image}
                  />
                </div>
                <div className='text-sm text-center text-dial-gray-dark'>
                  {format('profile.email')} : {session.user.email}
                </div>
              </div>
            </div>
          </div>
          <div className='w-full lg:w-2/3 xl:w-3/4'>
            <div className='my-4 h2'>
              {format('profile.profile')}{session.user.name}
            </div>
            <div className='my-3 h4'>
              {format('profile.roles')} {session.roles}
            </div>
            <div className='my-3 h4'>
              {format('profile.products')} {session.own && session.own.products}
            </div>
            <div className='my-3 h4'>
              {format('profile.organization')} {session.own && session.own.organization && session.own.organization.name}
            </div>
          </div>
        </div>}
      <Footer />
    </>
  )
}

export default UserProfile
