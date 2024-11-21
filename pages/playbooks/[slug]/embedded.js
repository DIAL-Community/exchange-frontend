import { useRouter } from 'next/router'
import PlaybookDetail from '../../../components/playbook/PlaybookDetail'
import EmbeddedFooter from '../../../components/shared/EmbeddedFooter'
import EmbeddedHeader from '../../../components/shared/EmbeddedHeader'
import ClientOnly from '../../../lib/ClientOnly'

const EmbeddedPlaybook = ({ defaultTenants }) => {
  const router = useRouter()
  const { locale, query: { slug } } = router

  return (
    <>
      <ClientOnly clientTenants={defaultTenants}>
        <EmbeddedHeader />
        <PlaybookDetail slug={slug} locale={locale} />
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
