import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import QueryNotification from '../../../components/shared/QueryNotification'
import GradientBackground from '../../../components/shared/GradientBackground'
import OrganizationForm from '../../../components/candidate/organizations/OrganizationForm'
import ClientOnly from '../../../lib/ClientOnly'

const CreateOrganization = () => (
  <>
    <QueryNotification />
    <GradientBackground />
    <Header />
    <div className='max-w-catalog mx-auto'>
      <ClientOnly>
        <OrganizationForm />
      </ClientOnly>
    </div>
    <Footer />
  </>
)

export default CreateOrganization
