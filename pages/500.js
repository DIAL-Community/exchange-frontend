import HealthFooter from '../components/health/sections/HealthFooter'
import HealthHeader from '../components/health/sections/HealthHeader'
import HubFooter from '../components/hub/sections/HubFooter'
import HubHeader from '../components/hub/sections/HubHeader'
import { InternalServerError, Loading } from '../components/shared/FetchStatus'
import Footer from '../components/shared/Footer'
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
    <div className='min-h-[70vh] bg-dial-alice-blue'>
      <InternalServerError />
    </div>
    <HealthFooter />
  </>

  const dpi500 =
    <>
      <HubHeader />
      <div className='min-h-[70vh] bg-dial-alice-blue'>
        <InternalServerError />
      </div>
      <HubFooter />
    </>

  return (
    <>
      { waitingActiveTenant || !tenant
        ? <Loading />
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
