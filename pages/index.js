import dynamic from 'next/dynamic'
import { handleLoadingSession } from '../components/shared/SessionQueryHandler'
import { useActiveTenant } from '../lib/hooks'

const HealthPage = dynamic(() => import('./landing/health'))
const HubPage = dynamic(() => import('./landing/hub'))
const LandingPage = dynamic(() => import('./landing/index'))

const RootPage = ({ dpiTenants, defaultTenants }) => {
  const { waitingActiveTenant, tenant } = useActiveTenant()

  return (
    <>
      { waitingActiveTenant
        ? handleLoadingSession()
        : tenant === 'dpi'
          ? <HubPage dpiTenants={dpiTenants} />
          : tenant === 'health'
            ? <HealthPage defaultTenants={defaultTenants} />
            : <LandingPage defaultTenants={defaultTenants} />
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
