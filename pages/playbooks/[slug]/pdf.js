import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import withApollo from '../../../lib/apolloClient'

const PlaybookPdf = dynamic(
  () => import('../../../components/playbooks/PlaybookPdf'),
  { ssr: true }
)

const DownloadPdf = () => {
  const router = useRouter()
  const { locale } = router

  return (
    <PlaybookPdf locale={locale} />
  )
}

export default withApollo()(DownloadPdf)