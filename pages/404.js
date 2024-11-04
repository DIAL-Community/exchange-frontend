import HealthFooter from '../components/health/sections/HealthFooter'
import HealthHeader from '../components/health/sections/HealthHeader'
import HubFooter from '../components/hub/sections/HubFooter'
import HubHeader from '../components/hub/sections/HubHeader'
import { Loading, NotFound } from '../components/shared/FetchStatus'
import Footer from '../components/shared/Footer'
import Header from '../components/shared/Header'
import { useActiveTenant } from '../lib/hooks'

const Custom404 = () => {
  const { waitingActiveTenant, tenant } = useActiveTenant()

  const default404 =
    <>
      <Header />
      <NotFound />
      <Footer />
    </>

  const health404 =
  <>
    <HealthHeader />
    <NotFound />
    <HealthFooter />
  </>

  const dpi404 =
    <>
      <HubHeader />
      <NotFound />
      <HubFooter />
    </>

  return (
    <>
      { waitingActiveTenant || !tenant
        ? <Loading />
        : tenant === 'dpi'
          ? dpi404
          : tenant === 'health'
            ? health404
            : default404
      }
    </>
  )
}

export default Custom404
