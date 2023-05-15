import dynamic from 'next/dynamic'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import EntityUpload from '../../components/entities/EntityUpload'
const Tooltip = dynamic(() => import('react-tooltip').then(x => x.Tooltip), { ssr: false })

const EntitiesUpload = () => (
  <>
    <Header />
    <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
    <EntityUpload />
    <Footer />
  </>
)

export default EntitiesUpload
