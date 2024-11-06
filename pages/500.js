import HealthFooter from '../components/health/sections/HealthFooter'
import HealthHeader from '../components/health/sections/HealthHeader'
import HubFooter from '../components/hub/sections/HubFooter'
import HubHeader from '../components/hub/sections/HubHeader'
import { InternalServerError } from '../components/shared/FetchStatus'
import Footer from '../components/shared/Footer'
import { handleLoadingQuery } from '../components/shared/GraphQueryHandler'
import Header from '../components/shared/Header'
import { useActiveTenant } from '../lib/hooks'

const Custom500 = () => {
  const { waitingActiveTenant, tenant } = useActiveTenant()

  const default500 =
    <>
      <Header />
      <InternalServerError />
      <Footer />
    </>

  const health500 =
  <>
    <HealthHeader />
    <InternalServerError />
    <HealthFooter />
  </>

  const dpi500 =
    <>
      <HubHeader />
      <InternalServerError />
      <HubFooter />
    </>

  return (
    <>
      { waitingActiveTenant || !tenant
        ? handleLoadingQuery()
        : tenant === 'dpi'
          ? dpi500
          : tenant === 'health'
            ? health500
            : default500
      }
    </>
  )
}

export default Custom500
