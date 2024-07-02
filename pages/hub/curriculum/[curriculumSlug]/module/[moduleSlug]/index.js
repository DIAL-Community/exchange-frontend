import { useCallback } from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import HubHeader from '../../../../../../components/hub/sections/HubHeader'
import ClientOnly from '../../../../../../lib/ClientOnly'
import HubFooter from '../../../../../../components/hub/sections/HubFooter'
import HubCurriculumModule from '../../../../../../components/hub/sections/HubCurriculumModule'

const HubCurriculumModulePage = ({ dpiTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()
  const { curriculumSlug, moduleSlug } = router.query

  return (
    <>
      <NextSeo
        title={format('app.title')}
        description={format('seo.description.about')}
      />
      <ClientOnly clientTenants={dpiTenants}>
        <HubHeader />
        <HubCurriculumModule curriculumSlug={curriculumSlug} moduleSlug={moduleSlug}/>
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

export default HubCurriculumModulePage
