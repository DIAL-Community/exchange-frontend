import { useRouter } from 'next/router'
import { gql, useQuery } from '@apollo/client'
import Head from 'next/head'
import { useIntl } from 'react-intl'
import withApollo from '../../../../../../../lib/apolloClient'
import Header from '../../../../../../../components/Header'
import Footer from '../../../../../../../components/Footer'
import { Loading, Error } from '../../../../../../../components/shared/FetchStatus'
import { MoveForm } from '../../../../../../../components/plays/moves/MoveForm'

const MOVE_QUERY = gql`
  query Move($playbookSlug: String!, $playSlug: String!, $moveSlug: String!) {
    move(playSlug: $playSlug, slug: $moveSlug) {
      id
      name
      slug
      resources
      moveDescription {
        description
      }
      play {
        name
        slug
      }
    }
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

function EditMove () {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()

  const { locale } = router
  const { slug, playSlug, moveSlug } = router.query
  const { loading, error, data } = useQuery(MOVE_QUERY, {
    variables: {
      playbookSlug: slug,
      playSlug: playSlug,
      moveSlug: moveSlug
    },
    skip: !slug && !playSlug && !moveSlug,
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
        data && data.move && data.play && data.playbook &&
          <div className='max-w-catalog mx-auto'>
            <MoveForm playbook={data.playbook} play={data.play} move={data.move} />
          </div>
      }
      <Footer />
    </>
  )
}

export default withApollo()(EditMove)
