import { useRouter } from 'next/router'
import { gql, useQuery } from '@apollo/client'
import Header from '../../../../../../../components/Header'
import Footer from '../../../../../../../components/Footer'
import { Loading, Error } from '../../../../../../../components/shared/FetchStatus'
import { MoveForm } from '../../../../../../../components/plays/moves/MoveForm'
import ClientOnly from '../../../../../../../lib/ClientOnly'

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

const EditMoveInformation = ({ slug, playSlug, moveSlug, locale }) => {
  const { loading, error, data } = useQuery(MOVE_QUERY, {
    variables: {
      playbookSlug: slug,
      playSlug,
      moveSlug
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
      {
        data && data.move && data.play && data.playbook &&
        <div className='max-w-catalog mx-auto'>
          <MoveForm playbook={data.playbook} play={data.play} move={data.move} />
        </div>
      }
    </>
  )
}

const EditMove = () => {
  const router = useRouter()

  const { locale } = router
  const { slug, playSlug, moveSlug } = router.query

  return (
    <>
      <Header />
      <ClientOnly>
        <EditMoveInformation {...{ slug, playSlug, moveSlug, locale }} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default EditMove
