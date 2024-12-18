import { useCallback } from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import { useQuery } from '@apollo/client'
import HubFooter from '../../../../../../components/hub/sections/HubFooter'
import HubHeader from '../../../../../../components/hub/sections/HubHeader'
import ResourceDetail from '../../../../../../components/resources/ResourceDetail'
import {
  handleLoadingQuery, handleMissingData, handleQueryError
} from '../../../../../../components/shared/GraphQueryHandler'
import { COUNTRY_DETAIL_QUERY } from '../../../../../../components/shared/query/country'
import { GRAPH_QUERY_CONTEXT } from '../../../../../../lib/apolloClient'
import ClientOnly from '../../../../../../lib/ClientOnly'

const HubCountryResourcePage = ({ dpiTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { query: { slug, resourceSlug } } = useRouter()

  const { loading, error, data } = useQuery(COUNTRY_DETAIL_QUERY, {
    variables: { slug },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError()
  } else if (!data?.country) {
    return handleMissingData()
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
        <ResourceDetail country={data?.country} slug={resourceSlug} />
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

export default HubCountryResourcePage
