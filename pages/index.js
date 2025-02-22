import dynamic from 'next/dynamic'
import { handleLoadingSession } from '../components/shared/SessionQueryHandler'
import { useActiveTenant } from '../lib/hooks'

const GovernmentPage = dynamic(() => import('./landing/government'))
const HealthPage = dynamic(() => import('./landing/health'))
const HubPage = dynamic(() => import('./landing/hub'))
const LandingPage = dynamic(() => import('./landing/index'))

const RootPage = ({ dpiTenants, defaultTenants }) => {
  const { waitingActiveTenant, tenant } = useActiveTenant()

  const handleTenantName = (tenant) => {
    switch (tenant) {
      case 'government':
        return <GovernmentPage defaultTenants={defaultTenants} />
      case 'health':
        return <HealthPage defaultTenants={defaultTenants} />
      case 'dpi':
        return <HubPage dpiTenants={dpiTenants} />
      default:
        return <LandingPage defaultTenants={defaultTenants} />
    }
  }

  return (
    <>
      { waitingActiveTenant || !tenant
        ? handleLoadingSession()
        : handleTenantName(tenant)
      }
    </>
  )
}

export async function getServerSideProps() {
  const response = await fetch(process.env.NEXTAUTH_URL + '/api/tenants')
  const { dpiTenants, defaultTenants } = await response.json()

  // Passing data to the page as props
  return { props: { dpiTenants, defaultTenants } }
}

export default RootPage
