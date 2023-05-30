import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { PlaybookForm } from '../../../components/playbooks/PlaybookForm'
import ClientOnly from '../../../lib/ClientOnly'
import { useUser } from '../../../lib/hooks'
import { Loading, Unauthorized } from '../../../components/shared/FetchStatus'

function CreatePlaybook () {
  const { isAdminUser, isEditorUser, loadingUserSession } = useUser()

  return (
    <>
      <Header />
      <ClientOnly>
        {loadingUserSession
          ? <Loading />
          : isAdminUser || isEditorUser
            ? <PlaybookForm />
            : <Unauthorized />
        }
      </ClientOnly>
      <Footer />
    </>
  )
}

export default CreatePlaybook
