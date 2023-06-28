import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { Loading, Error, Unauthorized } from '../../../components/shared/FetchStatus'
import { PlaybookForm } from '../../../components/playbooks/PlaybookForm'
import ClientOnly from '../../../lib/ClientOnly'
import NotFound from '../../../components/shared/NotFound'
import { useUser } from '../../../lib/hooks'
import { PLAYBOOK_QUERY } from '../../../queries/playbook'

function EditPlaybook () {
  const router = useRouter()

  const { isAdminUser, isEditorUser, loadingUserSession } = useUser()

  const { locale } = router
  const { slug } = router.query
  const { loading, error, data, refetch } = useQuery(PLAYBOOK_QUERY, {
    variables: { slug, locale },
    skip: !slug,
    context: { headers: { 'Accept-Language': locale } }
  })

  useEffect(() => {
    refetch()
  }, [refetch])

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.playbook) {
    return <NotFound />
  }

  return (
    <>
      <Header />
      {data?.playbook && (
        <ClientOnly>
          {loadingUserSession
            ? <Loading />
            : isAdminUser || isEditorUser
              ? <PlaybookForm playbook={data.playbook} />
              : <Unauthorized />
          }
        </ClientOnly>
      )}
      <Footer />
    </>
  )
}

export default EditPlaybook
