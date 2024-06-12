import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import ClientOnly from '../../../lib/ClientOnly'

const PlaybookPdf = dynamic(
  () => import('../../../components/playbook/PlaybookPdf'),
  { ssr: true }
)

const DownloadPdf = ({ defaultTenants }) => {
  const router = useRouter()
  const { locale } = router

  return (
    <ClientOnly clientTenants={defaultTenants}>
      <PlaybookPdf locale={locale} />
    </ClientOnly>
  )
}

export async function getServerSideProps() {
  const response = await fetch(process.env.NEXTAUTH_URL + '/api/tenants')
  const { defaultTenants } = await response.json()

  // Passing data to the page as props
  return { props: { defaultTenants } }
}

export default DownloadPdf
