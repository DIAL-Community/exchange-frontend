import { useRouter } from 'next/router'
import ClientOnly from '../../../lib/ClientOnly'
import { PlaybookDetailProvider } from '../../../ui/v1/playbook/context/PlaybookDetailContext'
import EmbeddedHeader from '../../../ui/v1/shared/EmbeddedHeader'
import EmbeddedFooter from '../../../ui/v1/shared/EmbeddedFooter'
import PlaybookDetail from '../../../ui/v1/playbook/PlaybookDetail'

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
