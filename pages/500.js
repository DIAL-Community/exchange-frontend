import Footer from '../components/shared/Footer'
import Header from '../components/shared/Header'
import { InternalServerError } from '../components/shared/FetchStatus'

const Custom500 = () => (
  <>
    <Header />
    <InternalServerError />
    <Footer />
  </>
)

export default Custom500
