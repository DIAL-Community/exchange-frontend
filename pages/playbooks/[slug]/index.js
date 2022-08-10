import { useRouter } from 'next/router'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { PlaybookDetailProvider } from '../../../components/playbooks/PlaybookDetailContext'
import PlaybookDetail from '../../../components/playbooks/PlaybookDetail'
import ClientOnly from '../../../lib/ClientOnly'

const Playbook = () => {
  const router = useRouter()
  const { locale, query } = router
  const { slug } = query

  return (
    <>
      <Header />
      <ClientOnly>
        <PlaybookDetailProvider>
          <PlaybookDetail slug={slug} locale={locale} />
        </PlaybookDetailProvider>
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Playbook
