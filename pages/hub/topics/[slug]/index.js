import { useCallback, useEffect, useState } from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import HubFooter from '../../../../components/hub/sections/HubFooter'
import HubHeader from '../../../../components/hub/sections/HubHeader'
import HubTopic from '../../../../components/hub/sections/HubTopic'
import QueryNotification from '../../../../components/shared/QueryNotification'
import ClientOnly from '../../../../lib/ClientOnly'

const HubTopicPage = ({ dpiTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [ pageNumber, setPageNumber ] = useState(0)

  const { push, query } = useRouter()
  const { page, slug } = query

  useEffect(() => {
    if (page) {
      setPageNumber(parseInt(page) - 1)
    }
  }, [page, setPageNumber])

  const onClickHandler = ({ nextSelectedPage, selected }) => {
    const destinationPage = typeof nextSelectedPage  === 'undefined' ? selected : nextSelectedPage
    push(
      { query: { ...query, page: destinationPage + 1 } },
      undefined,
      { shallow: true }
    )
  }

  return (
    <>
      <NextSeo
        title={format('ui.resource.topic.label')}
        description={format('hub.topic.subtitle')}
      />
      <ClientOnly clientTenants={dpiTenants}>
        <QueryNotification />
        <HubHeader />
        <HubTopic
          slug={slug}
          pageNumber={pageNumber}
          onClickHandler={onClickHandler}
        />
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

export default HubTopicPage
