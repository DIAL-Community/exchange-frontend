import HubFooter from '../components/hub/sections/HubFooter'
import HubHeader from '../components/hub/sections/HubHeader'
import { NotFound } from '../components/shared/FetchStatus'
import Footer from '../components/shared/Footer'
import { handleLoadingQuery } from '../components/shared/GraphQueryHandler'
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

  const dpi404 =
    <>
      <HubHeader />
      <div className='min-h-[70vh] bg-dial-alice-blue'>
        <NotFound />
      </div>
      <HubFooter />
    </>

  return (
    <>
      { waitingActiveTenant
        ? handleLoadingQuery()
        : tenant === 'dpi'
          ? dpi404
          : default404
      }
    </>
  )
}

export default Custom404
