import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import Head from 'next/head'
import { gql, useQuery } from '@apollo/client'
import { useEffect } from 'react'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import NotFound from '../../../components/shared/NotFound'
import withApollo from '../../../lib/apolloClient'
import PlayDetail from '../../../components/plays/PlayDetail'
import { Loading, Error } from '../../../components/shared/FetchStatus'

const PLAY_QUERY = gql`
  query Play($slug: String!) {
    play(slug: $slug) {
      id
      name
      slug
      tags
      imageFile
      playDescription {
        description
        locale
      }
      playMoves {
        name
        slug
        resources
        moveDescription {
          description
          locale
        }
      }
    }
  }
`

const Play = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()
  const { locale, query } = router
  const { slug } = query

  const { loading, error, data, refetch } = useQuery(PLAY_QUERY, {
    variables: { slug: slug },
    skip: !slug,
    context: { headers: { 'Accept-Language': locale } }
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
      {loading && <Loading />}
      {error && error.networkError && <Error />}
      {error && !error.networkError && <NotFound />}
      {
        data && data.play &&
          <div className='px-8'>
            <PlayDetail play={data.play} />
          </div>
      }
      <Footer />
    </>
  )
}

export default withApollo()(Play)
