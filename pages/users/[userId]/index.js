import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import Head from 'next/head'
import { useSession } from 'next-auth/client'
import { gql, useQuery } from '@apollo/client'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import NotFound from '../../../components/shared/NotFound'
import withApollo from '../../../lib/apolloClient'
import UserDetail from '../../../components/users/UserDetail'
import { Loading, Error, Unauthorized } from '../../../components/shared/FetchStatus'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

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
        imageFile
      }
    }
  }
`

const User = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const router = useRouter()
  const { locale, query } = router
  const { userId } = query

  const [session] = useSession()

  if (session && !session.user.roles.includes('admin')) {
    return (
      <Unauthorized />
    )
  }

  const { loading, error, data, refetch } = useQuery(USER_QUERY, {
    variables: { userId: userId },
    context: { headers: { 'Accept-Language': query.locale } },
    skip: !userId
  })

  useEffect(() => {
    refetch()
  }, [locale])

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
      {loading && <Loading />}
      {error && error.networkError && <Error />}
      {error && !error.networkError && <NotFound />}
      {
        data && data.user &&
          <UserDetail user={data.user} />
      }
      <Footer />
    </>
  )
}

export default withApollo()(User)
