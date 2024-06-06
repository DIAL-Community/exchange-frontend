import { useCallback, useEffect } from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import DpiFooter from '../../../../../../../components/dpi/sections/DpiFooter'
import DpiHeader from '../../../../../../../components/dpi/sections/DpiHeader'
import { Loading } from '../../../../../../../components/shared/FetchStatus'
import ClientOnly from '../../../../../../../lib/ClientOnly'

const DpiCurriculumSubModulePage = ({ dpiTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()
  const { curriculumSlug } = router.query

  useEffect(() => {
    router.push(`/dpi-curriculum/${curriculumSlug}/`)
  }, [router, curriculumSlug])

  return (
    <>
      <NextSeo
        title={format('app.title')}
        description={format('seo.description.about')}
      />
      <ClientOnly clientTenants={dpiTenants}>
        <DpiHeader />
        <Loading />
        <DpiFooter />
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

export default DpiCurriculumSubModulePage
