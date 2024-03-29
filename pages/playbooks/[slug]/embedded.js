import { useRouter } from 'next/router'
import ClientOnly from '../../../lib/ClientOnly'
import { PlaybookDetailProvider } from '../../../components/playbook/context/PlaybookDetailContext'
import EmbeddedHeader from '../../../components/shared/EmbeddedHeader'
import EmbeddedFooter from '../../../components/shared/EmbeddedFooter'
import PlaybookDetail from '../../../components/playbook/PlaybookDetail'

const EmbeddedPlaybook = () => {
  const router = useRouter()
  const { locale, query: { slug } } = router

  return (
    <>
      <ClientOnly>
        <EmbeddedHeader />
        <PlaybookDetailProvider>
          <PlaybookDetail slug={slug} locale={locale} />
        </PlaybookDetailProvider>
        <EmbeddedFooter />
      </ClientOnly>
    </>
  )
}

export default EmbeddedPlaybook
