import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import ClientOnly from '../../../lib/ClientOnly'

const PlaybookPdf = dynamic(
  () => import('../../../ui/v1/playbook/PlaybookPdf'),
  { ssr: true }
)

const DownloadPdf = () => {
  const router = useRouter()
  const { locale } = router

  return (
    <ClientOnly>
      <PlaybookPdf locale={locale} />
    </ClientOnly>
  )
}

export default DownloadPdf
