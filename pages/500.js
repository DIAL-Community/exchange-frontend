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
      { waitingActiveTenant
        ? <Loading />
        : tenant === 'dpi'
          ? dpi500
          : default500
      }
    </>
  )
}

export default Custom500
