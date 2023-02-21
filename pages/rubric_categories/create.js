import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ClientOnly from '../../lib/ClientOnly'
import RubricCategoryForm from '../../components/rubric-categories/RubricCategoryForm'
import { useUser } from '../../lib/hooks'
import { Loading, Unauthorized } from '../../components/shared/FetchStatus'

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
