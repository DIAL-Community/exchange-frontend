import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import Header from '../../../../../components/Header'
import Footer from '../../../../../components/Footer'
import { Loading, Error, Unauthorized } from '../../../../../components/shared/FetchStatus'
import { PlayForm } from '../../../../../components/plays/PlayForm'
import { MovePreviewProvider } from '../../../../../components/plays/moves/MovePreviewContext'
import { MoveListProvider } from '../../../../../components/plays/moves/MoveListContext'
import MovePreview from '../../../../../components/plays/moves/MovePreview'
import ClientOnly from '../../../../../lib/ClientOnly'
import NotFound from '../../../../../components/shared/NotFound'
import { useUser } from '../../../../../lib/hooks'
import { PLAY_QUERY } from '../../../../../queries/play'

const EditFormProvider = ({ children }) => {
  return (
    <MoveListProvider>
      <MovePreviewProvider>
        {children}
      </MovePreviewProvider>
    </MoveListProvider>
  )
}

const EditPlayInformation = ({ slug, playSlug, locale }) => {
  const { loading, error, data, refetch } = useQuery(PLAY_QUERY, {
    variables: { playSlug, playbookSlug: slug },
    skip: !playSlug && !slug,
    context: { headers: { 'Accept-Language': locale } }
  })

  useEffect(() => {
    refetch()
  }, [refetch])

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.play && !data?.playbook) {
    return <NotFound />
  }

  return (
    <>
      {data?.play && data?.playbook &&
        <EditFormProvider>
          <MovePreview />
          <PlayForm playbook={data.playbook} play={data.play} />
        </EditFormProvider>
      }
    </>
  )

}

function EditPlay() {
  const { isAdminUser, loadingUserSession } = useUser()
  const router = useRouter()

  const { locale } = router
  const { slug, playSlug } = router.query

  return (
    <>
      <Header />
      <ClientOnly>
        {loadingUserSession
          ? <Loading />
          : isAdminUser
            ? <EditPlayInformation slug={slug} playSlug={playSlug} locale={locale} />
            : <Unauthorized />}
      </ClientOnly>
      <Footer />
    </>
  )
}

export default EditPlay
