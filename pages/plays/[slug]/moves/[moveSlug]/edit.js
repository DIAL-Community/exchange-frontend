import { useRouter } from 'next/router'
import { gql, useQuery } from '@apollo/client'
import Head from 'next/head'
import { useIntl } from 'react-intl'
import withApollo from '../../../../../lib/apolloClient'
import Header from '../../../../../components/Header'
import Footer from '../../../../../components/Footer'
import { Loading, Error } from '../../../../../components/shared/FetchStatus'
import { MoveForm } from '../../../../../components/plays/moves/MoveForm'

const MOVE_QUERY = gql`
query Move($slug: String!) {
  move(slug: $slug) {
    id
    name
    slug
    resources
    moveDescriptions {
      description
      locale
    }
    playName
    playSlug
  }
}
`

function EditMove () {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()

  const { locale } = router
  const { moveSlug } = router.query
  const { loading, error, data } = useQuery(MOVE_QUERY, { variables: { slug: moveSlug, locale: locale }, skip: !moveSlug })

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
      {
        data && data.move &&
          <MoveForm move={data.move} action='update' />
      }
      <Footer />
    </>
  )
}

export default withApollo()(EditMove)
