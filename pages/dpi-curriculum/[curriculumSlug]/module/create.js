import { useCallback, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { allowedToView } from '../../../../components/dpi/admin/utilities'
import { CreateDpiCurriculumModule } from '../../../../components/dpi/sections/DpiCurriculumModuleForm'
import DpiFooter from '../../../../components/dpi/sections/DpiFooter'
import DpiHeader from '../../../../components/dpi/sections/DpiHeader'
import { Loading, Unauthorized } from '../../../../components/shared/FetchStatus'
import QueryNotification from '../../../../components/shared/QueryNotification'
import ClientOnly from '../../../../lib/ClientOnly'

const DpiCurriculumCreateModulePage = ({ dpiTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { query: { curriculumSlug } } = useRouter()

  const { data, status } = useSession()
  useEffect(() => {
    if (status === 'unauthenticated') {
      void signIn()
    }
  }, [status])

  return (
    <>
      <NextSeo
        title={format('app.title')}
        description={format('seo.description.about')}
      />
      <ClientOnly clientTenants={dpiTenants}>
        <QueryNotification />
        <DpiHeader />
        { status === 'unauthenticated' || status === 'loading'
          ? <Loading />
          : status === 'authenticated' && allowedToView(data.user)
            ? <CreateDpiCurriculumModule curriculumSlug={curriculumSlug} />
            : <Unauthorized />
        }
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

export default DpiCurriculumCreateModulePage
