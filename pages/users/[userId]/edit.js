import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import ClientOnly from '../../../lib/ClientOnly'
import Header from '../../../ui/v1/shared/Header'
import Footer from '../../../ui/v1/shared/Footer'
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
  } else if (error) {
    return <Error />
  } else if (!data?.user) {
    return <NotFound />
  }

  return (
    <>
      { data?.user && <UserForm user={data.user} /> }
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
