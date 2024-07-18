import { useCallback, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { allowedToView } from '../../../../../../../../components/hub/admin/utilities'
import { EditHubCurriculumSubModule } from '../../../../../../../../components/hub/sections/HubCurriculumSubModuleForm'
import HubFooter from '../../../../../../../../components/hub/sections/HubFooter'
import HubHeader from '../../../../../../../../components/hub/sections/HubHeader'
import { Loading, Unauthorized } from '../../../../../../../../components/shared/FetchStatus'
import QueryNotification from '../../../../../../../../components/shared/QueryNotification'
import ClientOnly from '../../../../../../../../lib/ClientOnly'

const HubCurriculumEditSubModulePage = ({ dpiTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const {
    query: {
      curriculumSlug,
      moduleSlug: curriculumModuleSlug,
      subModuleSlug: curriculumSubModuleSlug
    }
  } = useRouter()

  const { data, status } = useSession()
  useEffect(() => {
    if (status === 'unauthenticated') {
      void signIn()
    }
  }, [status])

  return (
    <>
      <NextSeo
        title={format('hub.curriculum.label')}
        description={format('hub.curriculum.title')}
      />
      <ClientOnly clientTenants={dpiTenants}>
        <QueryNotification />
        <HubHeader />
        { status === 'unauthenticated' || status === 'loading'
          ? <Loading />
          : status === 'authenticated' && allowedToView(data.user)
            ? <EditHubCurriculumSubModule
              curriculumSlug={curriculumSlug}
              curriculumModuleSlug={curriculumModuleSlug}
              curriculumSubModuleSlug={curriculumSubModuleSlug}
            />
            : <Unauthorized />
        }
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

export default HubCurriculumEditSubModulePage
