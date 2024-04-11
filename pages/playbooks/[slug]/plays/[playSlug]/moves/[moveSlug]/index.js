import { NextSeo } from 'next-seo'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import ClientOnly from '../../../../../../../lib/ClientOnly'
import MoveDetail from '../../../../../../../components/move/MoveDetail'
import Header from '../../../../../../../components/shared/Header'
import Footer from '../../../../../../../components/shared/Footer'

const Move = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { locale, query: { slug, playSlug, moveSlug } } = useRouter()

  return (
    <>
      <NextSeo
        title={format('ui.move.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.move.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly clientTenants={['default', 'fao']}>
        <Header />
        <MoveDetail
          moveSlug={moveSlug}
          playSlug={playSlug}
          playbookSlug={slug}
          locale={locale}
        />
        <Footer />
      </ClientOnly>
    </>
  )
}

export default Move
