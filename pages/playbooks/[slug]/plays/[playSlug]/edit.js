import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import Head from 'next/head'
import { useIntl } from 'react-intl'
import withApollo from '../../../../../lib/apolloClient'
import Header from '../../../../../components/Header'
import Footer from '../../../../../components/Footer'
import { Loading, Error } from '../../../../../components/shared/FetchStatus'
import { PlayForm } from '../../../../../components/plays/PlayForm'
import { MovePreviewProvider } from '../../../../../components/plays/moves/MovePreviewContext'
import { MoveListProvider } from '../../../../../components/plays/moves/MoveListContext'
import MovePreview from '../../../../../components/plays/moves/MovePreview'

const PLAY_QUERY = gql`
query Play($playbookSlug: String!, $playSlug: String!) {
  play(slug: $playSlug) {
    id
    name
    slug
    tags
    playDescription {
      id
      description
    }
    playMoves {
      id
      name
      slug
      moveDescription {
        description
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

const EditFormProvider = ({ children }) => {
  return (
    <MoveListProvider>
      <MovePreviewProvider>
        {children}
      </MovePreviewProvider>
    </MoveListProvider>
  )
}

function EditPlay () {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()

  const { locale } = router
  const { slug, playSlug } = router.query
  const { loading, error, data, refetch } = useQuery(PLAY_QUERY, {
    variables: { playSlug: playSlug, playbookSlug: slug },
    skip: !playSlug && !slug,
    context: { headers: { 'Accept-Language': locale } }
  })

  useEffect(() => {
    refetch()
  }, [refetch])

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
        data && data.play && data.playbook &&
          <div className='max-w-catalog mx-auto'>
            <EditFormProvider>
              <MovePreview />
              <PlayForm playbook={data.playbook} play={data.play} />
            </EditFormProvider>
          </div>
      }
      <Footer />
    </>
  )
}

export default withApollo()(EditPlay)
