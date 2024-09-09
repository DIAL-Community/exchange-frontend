import { useCallback, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { allowedToBrowseAdliPages } from '../../../../../../components/hub/admin/utilities'
import HubCurriculumModule from '../../../../../../components/hub/sections/HubCurriculumModule'
import HubFooter from '../../../../../../components/hub/sections/HubFooter'
import HubHeader from '../../../../../../components/hub/sections/HubHeader'
import { Loading, Unauthorized } from '../../../../../../components/shared/FetchStatus'
import ClientOnly from '../../../../../../lib/ClientOnly'

const HubCurriculumModulePage = ({ dpiTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()
  const { curriculumSlug, moduleSlug } = router.query

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
        <HubHeader />
        { status === 'unauthenticated' || status === 'loading'
          ? <Loading />
          : status === 'authenticated' && allowedToBrowseAdliPages(data?.user)
            ? <HubCurriculumModule
              curriculumSlug={curriculumSlug}
              moduleSlug={moduleSlug}
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

export default HubCurriculumModulePage
