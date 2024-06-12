import { useRouter } from 'next/router'
import ClientOnly from '../../../lib/ClientOnly'
import { PlaybookDetailProvider } from '../../../components/playbook/context/PlaybookDetailContext'
import EmbeddedHeader from '../../../components/shared/EmbeddedHeader'
import EmbeddedFooter from '../../../components/shared/EmbeddedFooter'
import PlaybookDetail from '../../../components/playbook/PlaybookDetail'

const EmbeddedPlaybook = ({ defaultTenants }) => {
  const router = useRouter()
  const { locale, query: { slug } } = router

  return (
    <>
      <ClientOnly clientTenants={defaultTenants}>
        <EmbeddedHeader />
        <PlaybookDetailProvider>
          <PlaybookDetail slug={slug} locale={locale} />
        </PlaybookDetailProvider>
        <EmbeddedFooter />
      </ClientOnly>
    </>
  )
}

export async function getServerSideProps() {
  const response = await fetch(process.env.NEXTAUTH_URL + '/api/tenants')
  const { defaultTenants } = await response.json()

  // Passing data to the page as props
  return { props: { defaultTenants } }
}

export default EmbeddedPlaybook
