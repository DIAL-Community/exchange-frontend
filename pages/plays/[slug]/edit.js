import { useRouter } from 'next/router'
import { gql, useQuery } from '@apollo/client'
import Head from 'next/head'
import { useIntl } from 'react-intl'
import withApollo from '../../../lib/apolloClient'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { Loading, Error } from '../../../components/shared/FetchStatus'
import { PlayForm } from '../../../components/plays/PlayForm'

const PLAY_QUERY = gql`
query Play($slug: String!) {
  play(slug: $slug) {
    id
    name
    slug
    tags
    playDescription {
      description
    }
    playMoves {
      name
      moveDescription {
        description
      }
    }
  }
}
`

function EditPlay () {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()

  const { locale } = router
  const { slug } = router.query
  const { loading, error, data } = useQuery(PLAY_QUERY, {
    variables: { slug: slug, locale: locale },
    skip: !slug,
    context: { headers: { 'Accept-Language': locale } }
  })

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
        data && data.play &&
          <PlayForm play={data.play} />
      }
      <Footer />
    </>
  )
}

export default withApollo()(EditPlay)
