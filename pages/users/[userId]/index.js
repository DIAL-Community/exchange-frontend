import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client'
import { useQuery } from '@apollo/client'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import NotFound from '../../../components/shared/NotFound'
import UserDetail from '../../../components/users/UserDetail'
import { Loading, Error, Unauthorized } from '../../../components/shared/FetchStatus'
import ClientOnly from '../../../lib/ClientOnly'
import { USER_QUERY } from '../../../queries/user'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const UserPageDefinition = ({ userId, locale }) => {
  const { loading, error, data, refetch } = useQuery(USER_QUERY, {
    variables: { userId },
    skip: !userId,
    context: { headers: { 'Accept-Language': locale } }
  })

  useEffect(() => {
    refetch()
  }, [locale, refetch])

  if (loading) {
    return <Loading />
  }

  if (error && error.networkError) {
    return <Error />
  }

  if (error && !error.networkError) {
    return <NotFound />
  }

  return (
    <>
      {
        data && data.user &&
          <UserDetail user={data.user} />
      }
    </>
  )
}

const User = () => {
  const router = useRouter()
  const [session] = useSession()

  if (session && !session.user.roles.includes('admin')) {
    return <Unauthorized />
  }

  const { locale, query } = router
  const { userId } = query

  return (
    <>
      <Header />
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      <ClientOnly>
        <UserPageDefinition userId={userId} locale={locale} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default User
