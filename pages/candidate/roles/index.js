import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import QueryNotification from '../../../components/shared/QueryNotification'
import ClientOnly from '../../../lib/ClientOnly'
import Header from '../../../components/shared/Header'
import Footer from '../../../components/shared/Footer'
import RoleRibbon from '../../../components/candidate/role/RoleRibbon'
import RoleTabNav from '../../../components/candidate/role/RoleTabNav'
import RoleMain from '../../../components/candidate/role/RoleMain'
import { DEFAULT_PAGE_SIZE } from '../../../components/utils/constants'
import { RoleFilterDispatchContext } from '../../../components/context/candidate/RoleFilterContext'

const RoleListPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  const { query: { page } } = useRouter()
  const { setPageNumber, setPageOffset } = useContext(RoleFilterDispatchContext)

  useEffect(() => {
    if (page) {
      setPageNumber(parseInt(page) - 1)
      setPageOffset((parseInt(page) - 1) * DEFAULT_PAGE_SIZE)
    }
  }, [page, setPageNumber, setPageOffset])

  return (
    <>
      <NextSeo
        title={format('ui.candidateRole.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.candidateRole.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <RoleRibbon />
          <RoleTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <RoleMain activeTab={activeTab} />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default RoleListPage
