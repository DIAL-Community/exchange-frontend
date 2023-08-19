import { useRouter } from 'next/router'
import ClientOnly from '../../../lib/ClientOnly'
import { PlaybookDetailProvider } from '../../../ui/v1/playbook/context/PlaybookDetailContext'
import PlaybookDetailHeader from '../../../ui/v1/playbook/fragments/PlaybookDetailHeader'
import PlaybookDetailNavigation from '../../../ui/v1/playbook/fragments/PlaybookDetailNavigation'
import PlaybookDetailOverview from '../../../ui/v1/playbook/fragments/PlaybookDetailOverview'
import PlaybookDetailPlayList from '../../../ui/v1/playbook/fragments/PlaybookDetailPlayList'
import EmbeddedHeader from '../../../ui/v1/shared/EmbeddedHeader'
import EmbeddedFooter from '../../../ui/v1/shared/EmbeddedFooter'

const EmbeddedPlaybook = () => {
  const router = useRouter()
  const { locale, query } = router
  const { slug } = query

  return (
    <>
      <EmbeddedHeader />
      <ClientOnly>
        <PlaybookDetailProvider>
          <div className='flex flex-col'>
            <PlaybookDetailHeader slug={slug} />
            <div className='flex gap-x-3'>
              <div className='hidden lg:block w-1/4'>
                <PlaybookDetailNavigation slug={slug} />
              </div>
              <div className='flex flex-col gap-3 w-full max-w-screen-lg'>
                <PlaybookDetailOverview slug={slug} locale={locale} />
                <PlaybookDetailPlayList slug={slug} locale={locale} />
                <div style={{ height: '50vh' }} />
              </div>
            </div>
          </div>
        </PlaybookDetailProvider>
      </ClientOnly>
      <EmbeddedFooter />
    </>
  )
}

export default EmbeddedPlaybook
