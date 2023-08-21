import { NextSeo } from 'next-seo'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import ClientOnly from '../../../../../lib/ClientOnly'
import PlayEdit from '../../../../../ui/v1/play/PlayEdit'
import Header from '../../../../../ui/v1/shared/Header'
import Footer from '../../../../../ui/v1/shared/Footer'

function EditPlay() {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()

  const { locale } = router
  const { slug, playSlug } = router.query

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
      <Header />
      <ClientOnly>
        <PlayEdit playSlug={playSlug} playbookSlug={slug} locale={locale}  />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default EditPlay
