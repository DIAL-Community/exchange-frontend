import { gql, useQuery } from '@apollo/client'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Header from '../../../../../../../components/Header'
import Footer from '../../../../../../../components/Footer'
import { MoveForm } from '../../../../../../../components/plays/moves/MoveForm'
import { Error, Loading } from '../../../../../../../components/shared/FetchStatus'
import NotFound from '../../../../../../../components/shared/NotFound'
import ClientOnly from '../../../../../../../lib/ClientOnly'

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

const CreateMoveInformation = ({ slug, playSlug, locale }) => {
  const { loading, error, data, refetch } = useQuery(PLAY_QUERY, {
    variables: { playbookSlug: slug, playSlug },
    skip: !slug && !playSlug,
    context: { headers: { 'Accept-Language': locale } }
  })

  useEffect(() => {
    refetch()
  }, [refetch, locale])

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
        data?.play && data?.playbook &&
          <MoveForm playbook={data.playbook} play={data.play} />
      }
    </>
  )
}

const CreateMove = () => {
  const router = useRouter()
  const { locale, query } = router
  const { slug, playSlug } = query

  return (
    <>
      <Header />
      <ClientOnly>
        <CreateMoveInformation {...{ slug, playSlug, locale }} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default CreateMove
