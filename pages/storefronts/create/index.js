import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ClientOnly from '../../../lib/ClientOnly'
import OrganizationForm from '../../../components/organizations/OrganizationForm'
import { Loading, Unauthorized } from '../../../components/shared/FetchStatus'
import { useUser } from '../../../lib/hooks'

const CreateStorefront = () => {
  const { isAdminUser, loadingUserSession } = useUser()

  return (
    <>
      <Header />
      <ClientOnly>
        {loadingUserSession
          ? <Loading />
          : isAdminUser
            ? <OrganizationForm />
            : <Unauthorized />}
      </ClientOnly>
      <Footer />
    </>
  )
}

export default CreateStorefront
