import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import Header from '../../../../../components/Header'
import Footer from '../../../../../components/Footer'
import { Loading, Error, Unauthorized } from '../../../../../components/shared/FetchStatus'
import { PlayForm } from '../../../../../components/plays/PlayForm'
import ClientOnly from '../../../../../lib/ClientOnly'
import NotFound from '../../../../../components/shared/NotFound'
import { useUser } from '../../../../../lib/hooks'
import { PLAY_QUERY } from '../../../../../queries/play'

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
        <PlayForm playbook={data.playbook} play={data.play} />
      }
    </>
  )

}

function EditPlay() {
  const { isAdminUser, isEditorUser, loadingUserSession } = useUser()
  const router = useRouter()

  const { locale } = router
  const { slug, playSlug } = router.query

  return (
    <>
      <Header />
      <ClientOnly>
        {loadingUserSession
          ? <Loading />
          : isAdminUser || isEditorUser
            ? <EditPlayInformation slug={slug} playSlug={playSlug} locale={locale} />
            : <Unauthorized />}
      </ClientOnly>
      <Footer />
    </>
  )
}

export default EditPlay
