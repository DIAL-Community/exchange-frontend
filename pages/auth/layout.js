import HubFooter from '../../components/hub/sections/HubFooter'
import HubHeader from '../../components/hub/sections/HubHeader'
import Footer from '../../components/shared/Footer'
import { handleLoadingQuery } from '../../components/shared/GraphQueryHandler'
import Header from '../../components/shared/Header'
import { useActiveTenant } from '../../lib/hooks'

const AuthLayoutPage = ({ isOnAuthPage, children }) => {
  const { waitingActiveTenant, tenant } = useActiveTenant()

  return (
    <>
      { waitingActiveTenant
        ? handleLoadingQuery()
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
