import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import Header from '../../../../../../../components/Header'
import Footer from '../../../../../../../components/Footer'
import { Loading, Error, Unauthorized } from '../../../../../../../components/shared/FetchStatus'
import { MoveForm } from '../../../../../../../components/plays/moves/MoveForm'
import ClientOnly from '../../../../../../../lib/ClientOnly'
import { useUser } from '../../../../../../../lib/hooks'
import NotFound from '../../../../../../../components/shared/NotFound'
import { MOVE_QUERY } from '../../../../../../../queries/move'

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
  } else if (error && error.networkError) {
    return <Error />
  } else if (error && !error.networkError) {
    return <NotFound />
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
  const { isAdminUser, loadingUserSession } = useUser()
  const router = useRouter()

  const { locale } = router
  const { slug, playSlug, moveSlug } = router.query

  return (
    <>
      <Header />
      <ClientOnly>
        {loadingUserSession
          ? <Loading />
          : isAdminUser
            ? <EditMoveInformation {...{ slug, playSlug, moveSlug, locale }} />
            : <Unauthorized />}
      </ClientOnly>
      <Footer />
    </>
  )
}

export default EditMove
