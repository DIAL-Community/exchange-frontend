import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { PlaybookDetailProvider } from '../../../components/playbooks/PlaybookDetailContext'
import ClientOnly from '../../../lib/ClientOnly'
import PlaybookDetailHeader from '../../../components/playbooks/PlaybookDetailHeader'
import PlaybookDetailNavigation from '../../../components/playbooks/PlaybookDetailNavigation'
import PlaybookDetailOverview from '../../../components/playbooks/PlaybookDetailOverview'
import PlaybookDetailPlayList from '../../../components/playbooks/PlaybookDetailPlayList'
import EmbeddedHeader from '../../../components/shared/EmbeddedHeader'
import EmbeddedFooter from '../../../components/shared/EmbeddedFooter'

const EmbeddedPlaybook = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()
  const { locale, query } = router
  const { slug } = query

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <EmbeddedHeader />
      <ClientOnly>
        <PlaybookDetailProvider>
          <div className='flex flex-col max-w-catalog mx-auto'>
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
