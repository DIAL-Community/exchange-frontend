import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import ClientOnly from '../../../lib/ClientOnly'

const PlaybookPdf = dynamic(
  () => import('../../../components/playbook/PlaybookPdf'),
  { ssr: true }
)

const DownloadPdf = () => {
  const router = useRouter()
  const { locale } = router

  return (
    <ClientOnly clientTenant='default'>
      <PlaybookPdf locale={locale} />
    </ClientOnly>
  )
}

export default DownloadPdf
