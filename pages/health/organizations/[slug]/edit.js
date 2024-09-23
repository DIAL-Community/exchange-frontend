import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Tooltip } from 'react-tooltip'
import ClientOnly from '../../../../lib/ClientOnly'
import OrganizationEdit from '../../../../components/health/organization/OrganizationEdit'
import HealthHeader from '../../../../components/health/sections/HealthHeader'
import HealthFooter from '../../../../components/health/sections/HealthFooter'

const EditOrganizationPage = ({ defaultTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { locale, query: { slug } } = useRouter()

  return (
    <>
      <NextSeo
        title={format('ui.organization.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.organization.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly clientTenants={defaultTenants}>
        <HealthHeader />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <OrganizationEdit slug={slug} locale={locale} />
        <HealthFooter />
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

export default EditOrganizationPage
