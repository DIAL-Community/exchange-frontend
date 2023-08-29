import Header from '../../ui/v1/shared/Header'
import Footer from '../../ui/v1/shared/Footer'
import ClientOnly from '../../lib/ClientOnly'
import { useUser } from '../../lib/hooks'
import { Loading, Unauthorized } from '../../ui/v1/shared/FetchStatus'
import { UserForm } from '../../components/users/UserForm'

const CreateUser = () => {
  const { isAdminUser, loadingUserSession } = useUser()

  return (
    <>
      <Header/>
      <ClientOnly>
        {loadingUserSession
          ? <Loading />
          : isAdminUser
            ? <UserForm />
            : <Unauthorized />
        }
      </ClientOnly>
      <Footer/>
    </>
  )
}

export default CreateUser
