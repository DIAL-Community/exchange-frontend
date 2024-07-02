import HubFooter from '../../components/hub/sections/HubFooter'
import HubHeader from '../../components/hub/sections/HubHeader'
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
          ? <>
            <HubHeader isOnAuthPage={isOnAuthPage} />
            {children}
            <HubFooter />
          </>
          : <>
            <Header isOnAuthPage={isOnAuthPage} />
            {children}
            <Footer />
          </>
      }
    </>
  )
}

export default AuthLayoutPage
