import Footer from '../ui/v1/shared/Footer'
import Header from '../ui/v1/shared/Header'
import { InternalServerError } from '../ui/v1/shared/FetchStatus'

const Custom500 = () => (
  <>
    <Header />
    <InternalServerError />
    <Footer />
  </>
)

export default Custom500
