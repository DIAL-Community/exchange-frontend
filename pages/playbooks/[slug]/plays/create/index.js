import { NextSeo } from 'next-seo'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import ClientOnly from '../../../../../lib/ClientOnly'
import Header from '../../../../../ui/v1/shared/Header'
import Footer from '../../../../../ui/v1/shared/Footer'
import PlayCreate from '../../../../../ui/v1/play/PlayCreate'

const CreatePlay = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { locale, query: { slug } } = useRouter()

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
        <PlayCreate playbookSlug={slug} locale={locale} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default CreatePlay
