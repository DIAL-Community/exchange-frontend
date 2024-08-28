import { useCallback } from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import { useQuery } from '@apollo/client'
import ResourceCreate from '../../../../../components/candidate/resource/ResourceCreate'
import HubFooter from '../../../../../components/hub/sections/HubFooter'
import HubHeader from '../../../../../components/hub/sections/HubHeader'
import { Error, Loading, NotFound } from '../../../../../components/shared/FetchStatus'
import { COUNTRY_DETAIL_QUERY } from '../../../../../components/shared/query/country'
import ClientOnly from '../../../../../lib/ClientOnly'

const CreateCountryResourcePage = ({ dpiTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { query: { slug } } = useRouter()

  const { loading, error, data } = useQuery(COUNTRY_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.country) {
    return <NotFound />
  }

  return (
    <>
      <NextSeo
        title={format('ui.resource.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.resource.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly clientTenants={dpiTenants}>
        <HubHeader />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <ResourceCreate country={data?.country} />
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

export default CreateCountryResourcePage
