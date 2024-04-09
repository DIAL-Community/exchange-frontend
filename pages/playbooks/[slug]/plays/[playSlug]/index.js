import { NextSeo } from 'next-seo'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import ClientOnly from '../../../../../lib/ClientOnly'
import Header from '../../../../../components/shared/Header'
import Footer from '../../../../../components/shared/Footer'
import PlayDetail from '../../../../../components/play/PlayDetail'
import { PlaybookDetailProvider } from '../../../../../components/playbook/context/PlaybookDetailContext'

const Play = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { locale, query: { slug, playSlug } } = useRouter()

  return (
    <>
      <NextSeo
        title={format('ui.play.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.play.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly clientTenant='default'>
        <Header />
        <PlaybookDetailProvider>
          <PlayDetail playSlug={playSlug} playbookSlug={slug} locale={locale} />
        </PlaybookDetailProvider>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default Play
