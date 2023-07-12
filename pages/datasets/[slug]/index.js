import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import DatasetDetail from '../../../components/datasets/DatasetDetail'
import ClientOnly from '../../../lib/ClientOnly'
const Tooltip = dynamic(() => import('react-tooltip').then(x => x.Tooltip), { ssr: false })

const Dataset = () => {
  const router = useRouter()
  const { locale, query } = router
  const { slug } = query

  return (
    <>
      <Header />
      <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
      <ClientOnly>
        <DatasetDetail slug={slug} locale={locale} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Dataset
