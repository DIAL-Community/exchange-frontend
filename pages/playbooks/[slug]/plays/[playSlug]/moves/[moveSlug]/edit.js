import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import ClientOnly from '../../../../../../../lib/ClientOnly'
import MoveEdit from '../../../../../../../components/move/MoveEdit'
import Header from '../../../../../../../components/shared/Header'
import Footer from '../../../../../../../components/shared/Footer'

const EditMove = ({ defaultTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { locale, query: { slug, playSlug, moveSlug } } = useRouter()

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
      <ClientOnly clientTenants={defaultTenants}>
        <Header />
        <MoveEdit
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

export default EditMove
