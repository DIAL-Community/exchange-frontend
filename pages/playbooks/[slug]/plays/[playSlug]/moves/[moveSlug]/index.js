import { useCallback } from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import MoveDetail from '../../../../../../../components/play-move/MoveDetail'
import Footer from '../../../../../../../components/shared/Footer'
import Header from '../../../../../../../components/shared/Header'
import ClientOnly from '../../../../../../../lib/ClientOnly'

const Move = ({ defaultTenants }) => {
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
      <ClientOnly clientTenants={defaultTenants}>
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

export async function getServerSideProps() {
  const response = await fetch(process.env.NEXTAUTH_URL + '/api/tenants')
  const { defaultTenants } = await response.json()

  // Passing data to the page as props
  return { props: { defaultTenants } }
}

export default Move
