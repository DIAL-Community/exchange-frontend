import { useCallback } from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { EditDpiCurriculumModule } from '../../../../../components/dpi/sections/DpiCurriculumModuleForm'
import DpiFooter from '../../../../../components/dpi/sections/DpiFooter'
import DpiHeader from '../../../../../components/dpi/sections/DpiHeader'
import QueryNotification from '../../../../../components/shared/QueryNotification'
import ClientOnly from '../../../../../lib/ClientOnly'

const EditDpiCurriculumModulePage = ({ dpiTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { query: { curriculumSlug, moduleSlug: curriculumModuleSlug } } = useRouter()

  return (
    <>
      <NextSeo
        title={format('app.title')}
        description={format('seo.description.about')}
      />
      <ClientOnly clientTenants={dpiTenants}>
        <QueryNotification />
        <DpiHeader />
        <EditDpiCurriculumModule
          curriculumSlug={curriculumSlug}
          curriculumModuleSlug={curriculumModuleSlug}
        />
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

export default EditDpiCurriculumModulePage
