import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import Header from '../../../../../components/Header'
import Footer from '../../../../../components/Footer'
import { PlayForm } from '../../../../../components/plays/PlayForm'
import { Loading, Error, Unauthorized } from '../../../../../components/shared/FetchStatus'
import ClientOnly from '../../../../../lib/ClientOnly'
import NotFound from '../../../../../components/shared/NotFound'
import { useUser } from '../../../../../lib/hooks'
import { PLAYBOOK_QUERY } from '../../../../../queries/play'

const CreatePlayInformation = ({ slug, locale }) => {
  const { loading, error, data } = useQuery(PLAYBOOK_QUERY, {
    variables: { playbookSlug: slug },
    skip: !slug,
    context: { headers: { 'Accept-Language': locale } }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.playbook) {
    return <NotFound />
  }

  return (
    <>
      {data?.playbook && <PlayForm playbook={data.playbook} />}
    </>
  )
}

function CreatePlay () {
  const { isAdminUser, isEditorUser, loadingUserSession } = useUser()

  const router = useRouter()
  const { locale } = router
  const { slug } = router.query

  return (
    <>
      <Header />
      <ClientOnly>
        {loadingUserSession
          ? <Loading />
          : isAdminUser || isEditorUser
            ? <CreatePlayInformation slug={slug} locale={locale} />
            : <Unauthorized />}
      </ClientOnly>
      <Footer />
    </>
  )
}

export default CreatePlay
