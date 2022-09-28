import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import ClientOnly from '../../../lib/ClientOnly'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { Loading, Error, Unauthorized } from '../../../components/shared/FetchStatus'
import { UserForm } from '../../../components/users/UserForm'
import NotFound from '../../../components/shared/NotFound'
import { useUser } from '../../../lib/hooks'
import { USER_QUERY } from '../../../queries/user'

const EditUserPageDefinition = ({ userId, locale }) => {
  const { loading, error, data } = useQuery(USER_QUERY, {
    variables: { userId, locale },
    skip: !userId,
    context: { headers: { 'Accept-Language': locale } }
  })

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
          <UserForm user={data.user} action='update' />
      }
    </>
  )
}

const EditUser = () => {
  const router = useRouter()
  const { isAdminUser, loadingUserSession } = useUser()

  const { locale } = router
  const { userId } = router.query

  return (
    <>
      <Header />
      <ClientOnly>
        {loadingUserSession
          ? <Loading />
          : isAdminUser
            ? <EditUserPageDefinition userId={userId} locale={locale} />
            : <Unauthorized />}
      </ClientOnly>
      <Footer />
    </>
  )
}

export default EditUser
