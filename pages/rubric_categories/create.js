import ClientOnly from '../../lib/ClientOnly'
import RubricCategoryForm from '../../components/rubric-categories/RubricCategoryForm'
import { useUser } from '../../lib/hooks'
import { Loading, Unauthorized } from '../../components/shared/FetchStatus'
import Header from '../../ui/v1/shared/Header'
import Footer from '../../ui/v1/shared/Footer'

const CreateCategoryForm = () => {
  const { isAdminUser, loadingUserSession } = useUser()

  return (
    <>
      <Header/>
      <ClientOnly>
        {loadingUserSession
          ? <Loading />
          : isAdminUser
            ? <RubricCategoryForm />
            : <Unauthorized />
        }
      </ClientOnly>
      <Footer/>
    </>
  )
}

export default CreateCategoryForm
