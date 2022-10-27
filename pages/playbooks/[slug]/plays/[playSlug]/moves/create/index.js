import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Header from '../../../../../../../components/Header'
import Footer from '../../../../../../../components/Footer'
import { MoveForm } from '../../../../../../../components/plays/moves/MoveForm'
import { Error, Loading, Unauthorized } from '../../../../../../../components/shared/FetchStatus'
import NotFound from '../../../../../../../components/shared/NotFound'
import ClientOnly from '../../../../../../../lib/ClientOnly'
import { useUser } from '../../../../../../../lib/hooks'
import { PLAY_QUERY } from '../../../../../../../queries/move'

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
  } else if (error && error.networkError) {
    return <Error />
  } else if (error && !error.networkError) {
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
  const { isAdminUser, loadingUserSession } = useUser()
  const router = useRouter()
  const { locale, query } = router
  const { slug, playSlug } = query

  return (
    <>
      <Header />
      <ClientOnly>
        {loadingUserSession
          ? <Loading />
          : isAdminUser
            ? < CreateMoveInformation {...{ slug, playSlug, locale }} />
            : <Unauthorized />}
      </ClientOnly>
      <Footer />
    </>
  )
}

export default CreateMove
