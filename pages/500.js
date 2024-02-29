import DpiFooter from '../components/dpi/sections/DpiFooter'
import DpiHeader from '../components/dpi/sections/DpiHeader'
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
      <DpiHeader />
      <InternalServerError />
      <DpiFooter />
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
