import { useRouter } from 'next/router'
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
import { useUser } from '../../../lib/hooks'
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
  } else if (error) {
    return <Error />
  } else if (!data?.user) {
    return <NotFound />
  }

  return (
    <>
      { data?.user && <UserDetail user={data.user} /> }
    </>
  )
}

const User = () => {
  const { user, isAdminUser, loadingUserSession } = useUser()

  const { locale, query } = useRouter()
  const { userId } = query

  return (
    <>
      <Header />
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      <ClientOnly>
        {
          loadingUserSession
            ? <Loading />
            : isAdminUser || String(user?.id) === String(userId)
              ? <UserPageDefinition userId={userId} locale={locale} />
              : <Unauthorized />
        }
      </ClientOnly>
      <Footer />
    </>
  )
}

export default User
