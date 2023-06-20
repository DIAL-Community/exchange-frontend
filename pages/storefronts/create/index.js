import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ClientOnly from '../../../lib/ClientOnly'
import { Loading, Unauthorized } from '../../../components/shared/FetchStatus'
import { useUser } from '../../../lib/hooks'
import StorefrontForm from '../../../components/organizations/storefronts/StorefrontForm'

const CreateStorefront = () => {
  const { isAdminUser, loadingUserSession } = useUser()

  return (
    <>
      <Header />
      <ClientOnly>
        {loadingUserSession
          ? <Loading />
          : isAdminUser
            ? <StorefrontForm />
            : <Unauthorized />}
      </ClientOnly>
      <Footer />
    </>
  )
}

export default CreateStorefront
