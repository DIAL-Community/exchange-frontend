import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import Head from 'next/head'
import { gql, useQuery } from '@apollo/client'
import { useEffect } from 'react'
import Header from '../../../../../components/Header'
import Footer from '../../../../../components/Footer'
import NotFound from '../../../../../components/shared/NotFound'
import withApollo from '../../../../../lib/apolloClient'
import PlayDetail from '../../../../../components/plays/PlayDetail'
import { Loading, Error } from '../../../../../components/shared/FetchStatus'

const PLAY_QUERY = gql`
  query Play($playbookSlug: String!, $playSlug: String!) {
    play(slug: $playSlug) {
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
    playbook(slug: $playbookSlug) {
      id
      name
      slug
    }
  }
`

const Play = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()
  const { locale, query } = router
  const { slug, playSlug } = query

  const { loading, error, data, refetch } = useQuery(PLAY_QUERY, {
    variables: { playbookSlug: slug, playSlug: playSlug },
    skip: !slug && !playSlug,
    context: { headers: { 'Accept-Language': locale } }
  })

  useEffect(() => {
    refetch()
  }, [refetch, locale])

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
        data && data.play && data.playbook &&
          <div className='px-8 max-w-catalog mx-auto'>
            <PlayDetail playbook={data.playbook} play={data.play} />
          </div>
      }
      <Footer />
    </>
  )
}

export default withApollo()(Play)
