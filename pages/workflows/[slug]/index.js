import { useRouter } from 'next/router'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import WorkflowDetail from '../../../components/workflows/WorkflowDetail'
import ClientOnly from '../../../lib/ClientOnly'

const Workflow = () => {
  const router = useRouter()
  const { locale, query } = router
  const { slug } = query

  return (
    <>
      <Header />
      <ClientOnly>
        <WorkflowDetail slug={slug} locale={locale} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Workflow
