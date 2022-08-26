import dynamic from 'next/dynamic'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import EntityUpload from '../../components/entities/EntityUpload'
const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false })

const EntitiesUpload = () => (
  <>
    <Header />
    <ReactTooltip className='tooltip-prose bg-dial-gray-dark text-white rounded' />
    <EntityUpload />
    <Footer />
  </>
)

export default EntitiesUpload
