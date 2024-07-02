import { useCallback, useEffect } from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import ClientOnly from '../../../../../lib/ClientOnly'
import HubHeader from '../../../../../components/hub/sections/HubHeader'
import { Loading } from '../../../../../components/shared/FetchStatus'
import HubFooter from '../../../../../components/hub/sections/HubFooter'

const HubCurriculumPage = ({ dpiTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()
  const { curriculumSlug } = router.query

  useEffect(() => {
    router.push(`/hub/curriculum/${curriculumSlug}/`)
  }, [router, curriculumSlug])

  return (
    <>
      <NextSeo
        title={format('app.title')}
        description={format('seo.description.about')}
      />
      <ClientOnly clientTenants={dpiTenants}>
        <HubHeader />
        <Loading />
        <HubFooter />
      </ClientOnly>
    </>
  )
}

export async function getServerSideProps() {
  const response = await fetch(process.env.NEXTAUTH_URL + '/api/tenants')
  const { dpiTenants } = await response.json()

  // Passing data to the page as props
  return { props: { dpiTenants } }
}

export default HubCurriculumPage
