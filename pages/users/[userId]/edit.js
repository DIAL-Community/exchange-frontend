import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { gql, useQuery } from '@apollo/client'
import Head from 'next/head'
import { useIntl } from 'react-intl'
import ClientOnly from '../../../lib/ClientOnly'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { Loading, Error, Unauthorized } from '../../../components/shared/FetchStatus'
import { UserForm } from '../../../components/users/UserForm'
import NotFound from '../../../components/shared/NotFound'

const USER_QUERY = gql`
  query User($userId: String!) {
    user(userId: $userId) {
      id
      username
      confirmed
      email
      roles
      organization {
        id
        name
        slug
      }
      products {
        name
        slug
        imageFile
      }
      allRoles
    }
  }
`

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
  const [session] = useSession()
  const { formatMessage } = useIntl()

  if (session && !session.user.roles.includes('admin')) {
    return <Unauthorized />
  }

  const format = (id) => formatMessage({ id })

  const { locale } = router
  const { userId } = router.query

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <ClientOnly>
        <EditUserPageDefinition userId={userId} locale={locale} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default EditUser
