import { Loading } from '../components/shared/FetchStatus'
import { useActiveTenant } from '../lib/hooks'
import DpiPage from './landing/dpi'
import LandingPage from './landing/index'

const RootPage = ({ dpiTenants, defaultTenants }) => {
  const { waitingActiveTenant, tenant } = useActiveTenant()

  return (
    <>
      { waitingActiveTenant
        ? <Loading />
        : tenant === 'dpi'
          ? <DpiPage dpiTenants={dpiTenants} />
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
