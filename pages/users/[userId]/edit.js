import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'

import withApollo from '../../../lib/apolloClient'
import { gql, useQuery } from "@apollo/client"

import Head from 'next/head'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { Loading, Error, Unauthorized } from '../../../components/shared/FetchStatus'

import { useIntl } from 'react-intl'

import { UserForm } from '../../../components/users/UserForm'

const USER_QUERY = gql`
  query User($userId: String!) {
    user(userId: $userId) {
      id
      username
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

function EditUser() {

  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()

  const [session] = useSession()

  if (session && !session.user.roles.includes('admin')) {
    return (
      <Unauthorized />
    )
  }

  const { locale } = router
  const { userId } = router.query
  const { loading, error, data } = useQuery(USER_QUERY, { variables: { userId: userId, locale: locale }, skip: !userId })

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error />
  }

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      {data && data.user &&
        <UserForm user={data.user} action='update' />
      }
      <Footer />
    </>
  )
}

export default withApollo()(EditUser)