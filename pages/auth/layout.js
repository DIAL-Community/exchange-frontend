import DpiFooter from '../../components/dpi/sections/DpiFooter'
import DpiHeader from '../../components/dpi/sections/DpiHeader'
import { Loading } from '../../components/shared/FetchStatus'
import Footer from '../../components/shared/Footer'
import Header from '../../components/shared/Header'
import { useActiveTenant } from '../../lib/hooks'

const AuthLayoutPage = ({ isOnAuthPage, children }) => {
  const { waitingActiveTenant, tenant } = useActiveTenant()

  return (
    <>
      { waitingActiveTenant
        ? <Loading />
        : tenant === 'dpi'
          ? <><DpiHeader isOnAuthPage={isOnAuthPage} /> {children} <DpiFooter /></>
          : <><Header isOnAuthPage={isOnAuthPage} /> {children} <Footer /> </>
      }
    </>
  )
}

export default AuthLayoutPage
