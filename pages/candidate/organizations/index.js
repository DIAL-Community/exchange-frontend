import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import QueryNotification from '../../../components/shared/QueryNotification'
import ClientOnly from '../../../lib/ClientOnly'
import Header from '../../../components/shared/Header'
import Footer from '../../../components/shared/Footer'
import OrganizationRibbon from '../../../components/candidate/organization/OrganizationRibbon'
import OrganizationTabNav from '../../../components/candidate/organization/OrganizationTabNav'
import OrganizationMain from '../../../components/candidate/organization/OrganizationMain'
import { DEFAULT_PAGE_SIZE } from '../../../components/utils/constants'
import { OrganizationFilterDispatchContext } from '../../../components/context/candidate/OrganizationFilterContext'

const OrganizationListPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  const { query: { page } } = useRouter()
  const { setPageNumber, setPageOffset } = useContext(OrganizationFilterDispatchContext)

  useEffect(() => {
    if (page) {
      setPageNumber(parseInt(page) - 1)
      setPageOffset((parseInt(page) - 1) * DEFAULT_PAGE_SIZE)
    }
  }, [page, setPageNumber, setPageOffset])

  return (
    <>
      <NextSeo
        title={format('ui.candidateOrganization.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.candidateOrganization.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <OrganizationRibbon />
          <OrganizationTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <OrganizationMain activeTab={activeTab} />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default OrganizationListPage
