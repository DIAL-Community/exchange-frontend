import { Loading } from '../components/shared/FetchStatus'
import { useActiveTenant } from '../lib/hooks'
import DpiPage from './landing/dpi'
import LandingPage from './landing/index'

const RootPage = () => {
  const { waitingActiveTenant, tenant } = useActiveTenant()

  return (
    <>
      { waitingActiveTenant
        ? <Loading />
        : tenant === 'dpi'
          ? <DpiPage />
          : <LandingPage />
      }
    </>
  )
}

export default RootPage
