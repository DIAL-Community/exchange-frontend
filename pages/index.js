import dynamic from 'next/dynamic'
import { handleLoadingSession } from '../components/shared/SessionQueryHandler'
import { useActiveTenant } from '../lib/hooks'

const EditablePage = dynamic(() => import('./landing/editable'))
const HealthPage = dynamic(() => import('./landing/health'))
const HubPage = dynamic(() => import('./landing/hub'))
const LandingPage = dynamic(() => import('./landing/index'))

const RootPage = ({ dpiTenants, defaultTenants }) => {
  const { waitingActiveTenant, tenant, editable } = useActiveTenant()

  const handleTenant = (tenant, editable) => {
    if (editable) {
      return <EditablePage defaultTenants={defaultTenants} />
    }

    switch (tenant) {
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
        : handleTenant(tenant, editable)
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
