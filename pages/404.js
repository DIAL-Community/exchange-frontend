import DpiFooter from '../components/dpi/sections/DpiFooter'
import DpiHeader from '../components/dpi/sections/DpiHeader'
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

  const dpi404 =
    <>
      <DpiHeader />
      <NotFound />
      <DpiFooter />
    </>

  return (
    <>
      { waitingActiveTenant
        ? <Loading />
        : tenant === 'dpi'
          ? dpi404
          : default404
      }
    </>
  )
}

export default Custom404
