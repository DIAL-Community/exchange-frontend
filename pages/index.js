import { useActiveTenant } from '../lib/hooks'
import LandingPage from './landing/index'
import DpiPage from './landing/dpi'

const RootPage = () => {
  const { tenant } = useActiveTenant()

  return (
    <>
      { tenant === 'dpi'? <DpiPage /> : <LandingPage /> }
    </>
  )
}

export default RootPage
