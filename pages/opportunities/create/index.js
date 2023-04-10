import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ClientOnly from '../../../lib/ClientOnly'
import OpportunityForm from '../../../components/opportunities/OpportunityForm'
import { Loading, Unauthorized } from '../../../components/shared/FetchStatus'
import { useUser } from '../../../lib/hooks'

const CreateOpportunity = () => {
  const { isAdminUser, loadingUserSession } = useUser()

  return (
    <>
      <Header />
      <ClientOnly>
        {loadingUserSession
          ? <Loading />
          : isAdminUser
            ? <OpportunityForm />
            : <Unauthorized />}
      </ClientOnly>
      <Footer />
    </>
  )
}

export default CreateOpportunity
