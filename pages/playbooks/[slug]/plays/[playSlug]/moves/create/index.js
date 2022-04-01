import Head from 'next/head'
import { useIntl } from 'react-intl'
import { gql, useQuery } from '@apollo/client'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import withApollo from '../../../../../../../lib/apolloClient'
import Header from '../../../../../../../components/Header'
import Footer from '../../../../../../../components/Footer'
import { MoveForm } from '../../../../../../../components/plays/moves/MoveForm'
import { Error, Loading } from '../../../../../../../components/shared/FetchStatus'
import NotFound from '../../../../../../../components/shared/NotFound'

const PLAY_QUERY = gql`
  query Play($playbookSlug: String!, $playSlug: String!) {
    play(slug: $playSlug) {
      id
      name
      slug
    }
    playbook(slug: $playbookSlug) {
      id
      name
      slug
    }
  }
`

function CreateMove () {
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
          <div className='max-w-catalog mx-auto'>
            <MoveForm playbook={data.playbook} play={data.play} />
          </div>
      }
      <Footer />
    </>
  )
}

export default withApollo()(CreateMove)
